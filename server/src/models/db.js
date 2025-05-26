import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "/home/deploy/lead_data_collection/data/db/urls.db",
  logging: false, // turn on for debugging
});

export default sequelize;
