import { Sequelize } from "sequelize";
import { URLS_DB_PATH } from "../config/config.js";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: URLS_DB_PATH,
  logging: false, // turn on for debugging
});

export default sequelize;
