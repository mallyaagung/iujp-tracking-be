"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class report_files extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      report_files.belongsTo(models.reports, {
        foreignKey: "reports_id",
        as: "report",
      });
    }
  }
  report_files.init(
    {
      report_files_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      reports_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mime_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file_buffer: {
        type: DataTypes.BLOB("long"), // PostgreSQL stores as BYTEA
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "report_files",
      timestamps: true,
      paranoid: true,
    }
  );
  return report_files;
};
