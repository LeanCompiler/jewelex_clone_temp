import { DataTypes } from "sequelize";
import sequelize from "./db.js";

const Url = sequelize.define(
  "Url",
  {
    slug: {
      type: DataTypes.STRING(16),
      primaryKey: true,
    },
    base: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    endpoint: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    indexes: [{ fields: ["slug"] }],
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Url;
