import sequelize from "./db.js";

async function initDb() {
  try {
    await sequelize.authenticate();
    // await sequelize.sync({ force: true }); // NOTE: DEV ONLY
    // await sequelize.sync({ alter: true }); // NOTE: DEV ONLY
    await sequelize.sync();
    console.log("SQLite DB synced");
  } catch (error) {
    console.error("SQLite DB sync failed");
    throw error;
  }
}

export default initDb;
