// clickhouse: https://clickhouse.com/docs/en/integrations/language-clients/nodejs
import { createClient } from "@clickhouse/client";
import fetch from "node-fetch";
import * as dotenv from "dotenv";
import { upperCase } from "./utils";
dotenv.config();


async function getConfig() {
  try {
    const url = process.env.ASSISTOR_CONFIG_URL || ""
    console.log("url", url)
    const response = await fetch(
      url,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    // 👇️ const result:
    const result = (await response.json()) as EnvConfigResponse;
    return result;
  } catch (error) {
    console.log("error message: ", error);
  }
}

async function main() {
  const result = await getConfig();
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
  dataset.meta?.forEach((x, idx) => {
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
