import mysql from "mysql"
import dotenv from "dotenv";

dotenv.config()

export const mysqlPool = mysql.createPool({
  host: "127.0.0.1",
  port: parseInt(process.env.MYSQL_PORT || "3306"),
  user: process.env.MYSQL_ACCOUNT || "root",
  password: process.env.MYSQL_PASSWORD || "123456",
  database: process.env.MYSQL_DATABASE || ""
})