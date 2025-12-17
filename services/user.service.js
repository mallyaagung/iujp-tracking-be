const totalPage = require("../helper/totalPage");
const { users } = require("../models");
const bcrypt = require("bcrypt");

const UserService = {
  create: async ({ username, password, company_name, role }) => {
    const existing = await users.findOne({ where: { username } });
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);

    const user = await users.create({
      username,
      password: hashed,
      company_name,
      role,
    });

    return user;
  },

  getAll: async ({ sort, sortType, pageSize, currentPage }) => {
    const arrSort = {
      username: "username",
      company: "company_name",
    };

    const arrSortType = {
      asc: "ASC",
      desc: "DESC",
    };

    const querySort = arrSort[sort] || arrSort.company;
    const querySortType = arrSortType[sortType] || arrSortType.asc;
    const limit = Number(pageSize) || 10;
    const current_Page = currentPage || 1;
    const offset = (current_Page - 1) * limit;

    const data = await users.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
      order: [[querySort, querySortType]],
      offset,
      limit,
    });

    const totalData = await users.count({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      col: "users_id",
    });

    const meta = {
      currentPage: Number(current_Page),
      pageCount: totalPage(totalData, limit),
      pageSize: limit,
    };

    return { data, meta };
  },

  getById: async (id) => {
    const data = await users.findOne({
      where: { users_id: id },
    });

    if (!data) throw new Error("Data user tidak ditemukan");

    return data;
  },

  update: async (id, payload) => {
    const data = await users.findOne({
      where: { users_id: id },
    });

    if (!data) throw new Error("Data user tidak ditemukan");

    await data.update(payload);

    return data;
  },

  delete: async (id) => {
    const data = await users.findOne({
      where: { users_id: id },
    });

    if (!data) throw new Error("Data user tidak ditemukan");

    await data.destroy();

    return data;
  },
};

module.exports = UserService;
