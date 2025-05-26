import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./data/urls.db",
  logging: false, // turn on for debugging
});

export default sequelize;
