"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class reports extends Model {
    static associate(models) {
      reports.belongsTo(models.users, {
        foreignKey: "users_id",
        as: "user",
      });

      reports.hasMany(models.report_files, {
        foreignKey: "reports_id",
        as: "files",
      });
    }
  }

  reports.init(
    {
      reports_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      users_id: { type: DataTypes.UUID, allowNull: false },
      year: { type: DataTypes.INTEGER, allowNull: false },
      quarter: { type: DataTypes.STRING, allowNull: false },
      site_name: { type: DataTypes.STRING(255), allowNull: true },
      permission: { type: DataTypes.STRING(255), allowNull: true },
      province: { type: DataTypes.STRING(255), allowNull: true },
      activity: { type: DataTypes.STRING(255), allowNull: true },
      contract_time: { type: DataTypes.DATE, allowNull: true },

      // VALUES
      contract_value: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      contract_realization: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      investation: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      receive_nation: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      receive_country: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      expend_local: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      expend_national: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      expend_import: { type: DataTypes.DECIMAL(15, 2), allowNull: true },

      // CURRENCY ENUMS
      contract_value_currency: {
        type: DataTypes.ENUM("Rp", "USD"),
        allowNull: true,
      },
      contract_realization_currency: {
        type: DataTypes.ENUM("Rp", "USD"),
        allowNull: true,
      },
      investation_currency: {
        type: DataTypes.ENUM("Rp", "USD"),
        allowNull: true,
      },
      receive_nation_currency: {
        type: DataTypes.ENUM("Rp", "USD"),
        allowNull: true,
      },
      receive_country_currency: {
        type: DataTypes.ENUM("Rp", "USD"),
        allowNull: true,
      },
      expend_local_currency: {
        type: DataTypes.ENUM("Rp", "USD"),
        allowNull: true,
      },
      expend_national_currency: {
        type: DataTypes.ENUM("Rp", "USD"),
        allowNull: true,
      },
      expend_import_currency: {
        type: DataTypes.ENUM("Rp", "USD"),
        allowNull: true,
      },

      // WORKFORCE
      workforce_local: { type: DataTypes.INTEGER, allowNull: true },
      workforce_national: { type: DataTypes.INTEGER, allowNull: true },
      workforce_foreign_role: { type: DataTypes.STRING(255), allowNull: true },
      workforce_foreign_qty: { type: DataTypes.INTEGER, allowNull: true },

      // PIC FIELDS
      pic: { type: DataTypes.STRING(255), allowNull: true },
      pic_letter_no: { type: DataTypes.STRING(255), allowNull: true },
      pic_letter_date: { type: DataTypes.DATEONLY, allowNull: true },
    },
    {
      sequelize,
      modelName: "reports",
      timestamps: true,
      paranoid: true,
    }
  );

  // CUSTOM STATIC METHOD (UNCHANGED)
  reports.getDetail = function (condition = {}) {
    return reports.findAll({
      ...condition,
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
          as: "user",
          attributes: [],
        },
        {
          model: sequelize.models.report_files,
          as: "files",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
  };

  return reports;
};
