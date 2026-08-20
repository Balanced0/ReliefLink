import mysql from "mysql2/promise";
import { configAPI } from "../../config.js";

export const db = mysql.createPool({
    uri: configAPI.dbUrl,
    multipleStatements: true
});