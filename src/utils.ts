import fetch from "node-fetch";

export function upperCase(text: string) {
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

export async function getConfig(sqlKey: string) {
  try {
    let url = process.env.ASSISTOR_CONFIG_URL || ""
    url = url.replace("sqlKey", sqlKey)
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