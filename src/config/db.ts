import { Sequelize, DataTypes, } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    dialect: "mysql",
    logging: (...msg) => console.log(msg),
  }
);

export const connectToDB = async () => {
  try {
    console.log('Trying to connect to the database...');
    if (!sequelize) {
      throw new Error('Cannot connect to DB, sequelize instance is null.');
    }
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Unable to connect to the database:', error.message);
    } else {
      console.error('An unknown error occurred while trying to connect to the database.');
    }
  }
};

export const closeDb = async () => {
  try {
    await sequelize.close();
    console.log('Connection has been closed successfully.');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Unable to connect to the database:', error.message);
    } else {
      console.error('An unknown error occurred while trying to close the database connection.');
    }
  }
};