const { Op } = require("sequelize");
const getCurrentQuarter = require("../helper/getQuarter");
const totalPage = require("../helper/totalPage");
const { reports, report_files, users, sequelize } = require("../models");
const excel4node = require("excel4node");

const ReportService = {
  getAll: async ({ sort, sortType, pageSize, currentPage, id }) => {
    try {
      const arrSort = {
        createdAt: "createdAt",
        sitename: "site_name",
      };

      const arrSortType = {
        asc: "ASC",
        desc: "DESC",
      };

      const querySort = arrSort[sort] || arrSort.createdAt;
      const querySortType = arrSortType[sortType] || arrSortType.asc;
      const limit = Number(pageSize) || 10;
      const current_Page = currentPage || 1;
      const offset = (current_Page - 1) * limit;

      const userId = Buffer.from(id, "base64").toString("ascii");

      const checkUser = await users.findOne({
        where: { users_id: userId },
      });

      let condition = {};

      if (checkUser.role === "USER") {
        condition.users_id = checkUser.users_id;
      }

      const data = await reports.findAll({
        where: condition,
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
          include: [
            [sequelize.col("user.username"), "username"],
            [sequelize.col("user.company_name"), "company_name"],
          ],
        },
        include: [
          {
            model: sequelize.models.users,
            attributes: [],
            as: "user",
          },
        ],
        order: [[querySort, querySortType]],
        offset,
        limit,
        subQuery: false,
      });

      const totalData = await reports.count({
        where: condition,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: sequelize.models.users,
            attributes: [],
            as: "user",
          },
        ],
        col: "reports_id",
      });

      const meta = {
        currentPage: Number(current_Page),
        pageCount: totalPage(totalData, limit),
        pageSize: limit,
      };

      return { data, meta };
    } catch (error) {
      console.log(error);

      throw error;
    }
  },

  getById: async ({ id }) => {
    const data = await reports.getDetail({
      where: { reports_id: id },
    });

    if (!data) throw new Error("Data laporan tidak ditemukan");

    return data;
  },

  getReportSubmissionStats: async ({ year, quarter }) => {
    try {
      // total users
      const totalUsers = await users.count();

      // users that submitted report this quarter
      const submittedUsers = await reports.count({
        distinct: true,
        col: "users_id",
        where: { year, quarter },
        logging: true,
      });

      const dataSubmit = await reports.findAll({
        where: { year, quarter },
        attributes: {
          include: [
            [sequelize.col("user.username"), "username"],
            [sequelize.col("user.company_name"), "company_name"],
          ],
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        include: [
          {
            model: sequelize.models.users,
            attributes: [],
            as: "user",
          },
        ],
      });

      const usersId = dataSubmit.map((item) => item.users_id);
      // users that have NOT submitted
      const notSubmittedUsers = totalUsers - submittedUsers;

      let condition = {};
      if (submittedUsers > 0) {
        condition.users_id = {
          [Op.notIn]: usersId.length > 0 ? usersId : [""],
        };
      }

      const dataNotSubmit = await users.findAll({
        where: condition,
      });

      return {
        year,
        quarter,
        totalUsers,
        submittedUsers,
        notSubmittedUsers,
        dataSubmit,
        dataNotSubmit,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  exportReport: async (data) => {
    try {
      const wb = new excel4node.Workbook({ author: "Ayam Goreng Kalasan" });
      const ws = wb.addWorksheet("Sheet 1");

      // Create a reusable style
      const titleStyle = wb.createStyle({
        font: {
          color: "#000000",
          size: 18,
          bold: true,
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
        fill: {
          type: "pattern",
          patternType: "solid",
          fgColor: "#ffffff", // white background (clean)
        },
      });

      const headerStyle = wb.createStyle({
        font: {
          color: "#000000",
          size: 12,
          bold: true,
        },
        fill: {
          type: "pattern", // the only one implemented so far.
          patternType: "solid", // most common.
          fgColor: "#40a8bd", // you can add two extra characters to serve as alpha, i.e. '2172d7aa'.
          // bgColor: 'ffffff' // bgColor only applies on patternTypes other than solid.
        },
        alignment: {
          horizontal: "center",
        },
        border: {
          left: {
            style: "thin",
            color: "#000000",
          },
          top: {
            style: "thin",
            color: "#000000",
          },
          right: {
            style: "thin",
            color: "#000000",
          },
          bottom: {
            style: "thin",
            color: "#000000",
          },
        },
      });

      const valueStyle = wb.createStyle({
        font: { size: 12 },
        alignment: {
          horizontal: "left",
        },
        border: {
          left: {
            style: "thin",
            color: "#000000",
          },
          top: {
            style: "thin",
            color: "#000000",
          },
          right: {
            style: "thin",
            color: "#000000",
          },
          bottom: {
            style: "thin",
            color: "#000000",
          },
        },
      });

      if (data.status) {
        ws.cell(1, 1).string("Data User yang sudah report").style(titleStyle);
        //===============
        ws.cell(2, 1).string("No.").style(headerStyle);
        ws.cell(2, 2).string("Nama User").style(headerStyle);
        ws.cell(2, 3).string("Nama Perusahaan").style(headerStyle);
        ws.cell(2, 4).string("Nama Site / IUP").style(headerStyle);
        ws.cell(2, 5).string("Triwulan").style(headerStyle);
        ws.cell(2, 6).string("Tahun").style(headerStyle);
      } else {
        ws.cell(1, 1).string("Data User yang belum report").style(titleStyle);
        //===============
        ws.cell(2, 1).string("No.").style(headerStyle);
        ws.cell(2, 2).string("Nama User").style(headerStyle);
        ws.cell(2, 3).string("Nama Perusahaan").style(headerStyle);
      }

      let count = 3;
      for (const item of data.data) {
        if (data.status) {
          ws.cell(count, 1)
            .number(count - 1)
            .style(valueStyle);
          ws.cell(count, 2).string(item.username).style(valueStyle);
          ws.cell(count, 3).string(item.company_name).style(valueStyle);
          ws.cell(count, 4).string(item.site_name).style(valueStyle);
          ws.cell(count, 5).string(item.quarter).style(valueStyle);
          ws.cell(count, 6).number(item.year).style(valueStyle);
          count++;
        } else {
          ws.cell(count, 1)
            .number(count - 1)
            .style(valueStyle);
          ws.cell(count, 2).string(item.username).style(valueStyle);
          ws.cell(count, 3).string(item.company_name).style(valueStyle);
          count++;
        }
      }

      return wb;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  create: async (payload, files) => {
    const transaction = await sequelize.transaction();

    try {
      const report = await reports.create(payload, { transaction });

      if (files?.length) {
        const fileRows = files.map((file) => ({
          reports_id: report.reports_id,
          file_name: file.originalname,
          mime_type: file.mimetype,
          file_buffer: file.buffer,
        }));

        await report_files.bulkCreate(fileRows, { transaction });
      }

      await transaction.commit();

      return {
        message: "Report created successfully",
        reports_id: report.reports_id,
      };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  update: async (id, payload) => {
    const data = await reports.findOne({
      where: { reports_id: id },
    });

    if (!data) throw new Error("Data laporan tidak ditemukan");

    await data.update(payload);

    return data;
  },

  delete: async (id) => {
    const data = await reports.findOne({
      where: { reports_id: id },
    });

    if (!data) throw new Error("Data user tidak ditemukan");

    await data.destroy();

    return data;
  },
};

module.exports = ReportService;
