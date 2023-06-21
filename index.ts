// clickhouse: https://clickhouse.com/docs/en/integrations/language-clients/nodejs
import { createClient } from "@clickhouse/client";
import fetch from "node-fetch";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

type DBConfig = {
  db: string;
  host: string;
  password: string;
  username: string;
};

type EnvConfigResponse = {
  code: number;
  data: {
    Result: string;
  };
};

export interface Dataset {
  meta?: MetaEntity[] | null;
  data?: DataEntity[] | null;
  rows: number;
  rows_before_limit_at_least: number;
  statistics: Statistics;
}
export interface MetaEntity {
  name: string;
  type: string;
}
export interface DataEntity {
  id: string;
  from_uid: number;
  to_uid: number;
  clubid: string;
  action_type: string;
  action_time: string;
  attach: string;
  leagueid: string;
  ds: number;
}
export interface Statistics {
  elapsed: number;
  rows_read: number;
  bytes_read: number;
}

async function getConfig() {
  try {
    const url = process.env.ASSISTOR_CONFIG_URL || ""
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

function upperCase(text: string) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    if (i === 0) {
      result += text[i].toLocaleUpperCase();
    } else if (text[i] === "_") {
      result += text[i + 1].toLocaleUpperCase();
      i++;
    } else {
      result += text[i];
    }
  }
  return result;
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

  let text = `message ProtoBufName {
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
