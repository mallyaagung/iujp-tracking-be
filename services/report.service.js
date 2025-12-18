const { Op } = require("sequelize");
const totalPage = require("../helper/totalPage");
const { reports, report_files, users, sequelize } = require("../models");
const excel4node = require("excel4node");

const ReportService = {
  getAll: async ({
    sort,
    sortType,
    pageSize,
    currentPage,
    id,
    year,
    quarter,
    search,
  }) => {
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

      if (search) {
        condition.company_name = { [Op.substring]: search.toUpperCase() };
      }

      if (checkUser.role === "USER") {
        condition.users_id = checkUser.users_id;
      }

      const data = await users.findAll({
        where: condition,
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "deletedAt",
            "username",
            "password",
            "role",
          ],
          include: [
            [
              sequelize.fn("COUNT", sequelize.col("reports.reports_id")),
              "report_count",
            ],
          ],
        },
        include: [
          {
            model: sequelize.models.reports,
            as: "reports",
            attributes: [],
            where: {
              year,
              quarter,
            },
          },
        ],
        group: ["users.users_id"],
        order: [["company_name", "ASC"]],
        limit,
        offset,
        subQuery: false,
      });

      const totalData = await users.count({
        where: condition,
        include: [
          {
            model: sequelize.models.reports,
            as: "reports",
            attributes: [],
            where: {
              year,
              quarter,
            },
            required: true,
          },
        ],
        distinct: true,
        col: "users_id",
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

  getById: async (id) => {
    const data = await reports.getDetail({
      where: { users_id: id },
    });

    if (!data) throw new Error("Data laporan tidak ditemukan");

    return data;
  },

  getReportSubmissionStats: async ({
    year,
    quarter,
    pageSize,
    currentPage,
  }) => {
    try {
      const limit = Number(pageSize) || 10;
      const current_Page = currentPage || 1;
      const offset = (current_Page - 1) * limit;

      // total users
      const totalUsers = await users.count();

      // users that submitted report this quarter
      const submittedUsers = await reports.count({
        distinct: true,
        col: "users_id",
        where: { year, quarter },
      });

      const dataSubmit = await reports.findAll({
        where: { year, quarter },
        attributes: [
          "users_id",

          // aggregated report info
          [sequelize.fn("MAX", sequelize.col("reports.year")), "year"],
          [sequelize.fn("MAX", sequelize.col("reports.quarter")), "quarter"],

          // user info
          [sequelize.col("user.username"), "username"],
          [sequelize.col("user.company_name"), "company_name"],

          // example metric
          [
            sequelize.fn("COUNT", sequelize.col("reports.users_id")),
            "total_reports",
          ],
        ],
        include: [
          {
            model: sequelize.models.users,
            as: "user",
            attributes: [],
          },
        ],
        group: ["reports.users_id", "user.username", "user.company_name"],
        order: [[sequelize.col("user.username"), "ASC"]],
        limit,
        offset,
        subQuery: false,
      });

      console.log(dataSubmit);

      // users that have NOT submitted
      const notSubmittedUsers = totalUsers - submittedUsers;

      const dataNotSubmit = await users.findAll({
        where: {
          users_id: {
            [Op.notIn]: sequelize.literal(`
        (SELECT users_id FROM reports WHERE year = ${year} AND quarter = '${quarter}')
      `),
          },
        },
        order: [["company_name", "ASC"]],
        limit,
        offset,
        subQuery: false,
      });

      const metaSubmitted = {
        currentPage: Number(current_Page),
        pageCount: totalPage(submittedUsers, limit),
        pageSize: limit,
      };

      const metaNotSubmitted = {
        currentPage: Number(current_Page),
        pageCount: totalPage(notSubmittedUsers, limit),
        pageSize: limit,
      };

      return {
        year,
        quarter,
        totalUsers,
        submittedUsers,
        notSubmittedUsers,
        dataSubmit,
        dataNotSubmit,
        metaSubmitted,
        metaNotSubmitted,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  exportReport: async (data, year, quarter) => {
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

      const dataSubmit = await users.findAll({
        attributes: [
          [sequelize.col("users.users_id"), "users_id"],
          "username",
          "company_name",
          [sequelize.col("reports.site_name"), "site_name"],
        ],
        include: [
          {
            model: sequelize.models.reports,
            attributes: [],
            as: "reports",
            required: false,
            where: { year, quarter },
          },
        ],
        raw: true,
      });

      if (data.status) {
        ws.cell(1, 1, 1, 5, true)
          .string(
            `Data user yang sudah report tahun ${year} kuartal ${quarter}`
          )
          .style(titleStyle);
        //===============
        ws.cell(2, 1).string("No.").style(headerStyle);
        ws.cell(2, 2).string("Nama Perusahaan").style(headerStyle);
        ws.cell(2, 3).string("Nama Site / IUP").style(headerStyle);
      } else {
        ws.cell(1, 1, 1, 3, true)
          .string(
            `Data user yang belum report tahun ${year} kuartal ${quarter}`
          )
          .style(titleStyle);
        //===============
        ws.cell(2, 1).string("No.").style(headerStyle);
        ws.cell(2, 2).string("Nama Perusahaan").style(headerStyle);
      }

      let count = 3;
      for (const item of dataSubmit) {
        const shouldInclude =
          (data.status && item.site_name) || (!data.status && !item.site_name);

        if (!shouldInclude) continue;

        if (data.status) {
          ws.cell(count, 1)
            .number(count - 2)
            .style(valueStyle);
          ws.cell(count, 2).string(item.company_name).style(valueStyle);
          ws.cell(count, 3).string(item.site_name).style(valueStyle);
        } else {
          ws.cell(count, 1)
            .number(count - 2)
            .style(valueStyle);
          ws.cell(count, 2).string(item.company_name).style(valueStyle);
        }

        count++;
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
      const parsed = JSON.parse(payload);

      let fileRows = [];

      for (const item of parsed) {
        const checkReport = await reports.findOne({
          where: {
            users_id: item.users_id,
            site_name: item.site_name,
            year: item.year,
            quarter: item.quarter,
          },
          attributes: ["reports_id"],
        });

        if (checkReport) continue;

        const report = await reports.create(item, { transaction });

        const newFile = files.find((f) => f.fieldname.includes(item.temp_id));

        if (newFile) {
          fileRows.push({
            reports_id: report.reports_id,
            file_name: newFile.originalname,
            mime_type: newFile.mimetype,
            file_buffer: newFile.buffer,
          });
        }
      }

      if (fileRows.length > 0) {
        await report_files.bulkCreate(fileRows, { transaction });
      }

      await transaction.commit();

      return {
        message: "Report created successfully",
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
    const deletedCount = await reports.destroy({
      where: { users_id: id },
    });

    if (deletedCount === 0) {
      throw new Error("Data user tidak ditemukan");
    }

    return deletedCount;
  },
};

module.exports = ReportService;
