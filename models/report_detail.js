"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReportDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ReportDetail.belongsTo(models.Report, {
      //   foreignKey: "report_id",
      //   as: "report",
      // });
    }
  }
  ReportDetail.init(
    {
      report_detail_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      report_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
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
      modelName: "ReportDetail",
      tableName: "ReportsDetail",
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
    }
  );
  return ReportDetail;
};
