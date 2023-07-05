/**
 * clickhouse sql to protobuff
 */
// clickhouse: https://clickhouse.com/docs/en/integrations/language-clients/nodejs
import { createClient } from "@clickhouse/client";
import * as dotenv from "dotenv";
import { upperCase, getConfig } from "./utils";
dotenv.config();

async function main() {
  const result = await getConfig('clickhouse.m1_clickhouse_kkpoker');
  const config: DBConfig = result?.data?.Result
    ? JSON.parse(result.data.Result)
    : {};
  // console.log("config", config);

  const client = createClient({
    host: `http://${config.host}`,
    database: config.db,
    username: config.username,
    password: config.password,
  });

  const sqlStr = process.env.SQL;
  const resultSet = await client.query({
    query: `${sqlStr} LIMIT 0, 1`,
    format: "JSON",
  });
  const dataset = (await resultSet.json()) as Dataset;

  // console.log('dataset meta', dataset.meta)

  let text = `message XXXXXXXXListRow {
`;
  dataset.meta?.forEach((x: any, idx: any) => {
    text += `  // @gotags: json:"${x.name}"
  ${x.type.toLocaleLowerCase()} ${upperCase(x.name)} = ${idx + 1
      } [json_name = "${x.name}"];
`;
  });
  text += "}";

  console.log(text);
  await client.close();
}
main();
