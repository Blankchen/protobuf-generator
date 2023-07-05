/**
 * mysql meta to yml
 */
import { getConfig } from "./utils";
import * as mysql from "mysql2";
import * as dotenv from "dotenv";
dotenv.config();

// sql to go: https://zihengcat.github.io/2020/09/28/go-sql-data-types-mapping/
const typeMap: { [key: string]: string; } = {
  'tinyint': 'int8',
  'smallint': 'int16',
  'mediumint': 'int32',
  'int': 'int32',
  'bigint': 'int64',
  'float': 'float32',
  'double': 'float64',
  'date': 'date',
  'datetime': 'datetime',
  'timestamp': 'datetime',
}


async function main() {
  const result = await getConfig('mysql.m2_adb_flow');
  const config: DBConfig = result?.data?.Result
    ? JSON.parse(result.data.Result)
    : {};

  const connection = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.db,
  });
  
  const tableName = 'flow_club';

  connection.query(
    `SHOW COLUMNS FROM ${tableName}`,
    function(err: any, results: Array<MysqlColumns>) {
      // console.log(results)
      // return

      let readColumn = 'column:'
      let writeColumn = 'column:'
      results.forEach((x: MysqlColumns) => {
        const type = typeMap[x.Type]
        x.Type
        readColumn +=  `
        - "${x.Field}"`
        writeColumn += `
        - "${x.Field}`
        if (type) {
          writeColumn += `:${type}`
        }
        writeColumn += `"`
      });

      console.log(readColumn);
      console.log(writeColumn);

    }
  );
}

main();