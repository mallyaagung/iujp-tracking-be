"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class reports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
      site_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      permission: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      province: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      activity: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      contract_time: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      contract_value: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      contract_realization: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      investation: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      receive_nation: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      receive_country: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      expend_local: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      expend_national: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      expend_import: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      workforce_local: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      workforce_national: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      workforce_foreign_role: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      workforce_foreign_qty: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      pic: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      pic_letter_no: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      pic_letter_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "reports",
      timestamps: true,
      paranoid: true,
    }
  );

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
