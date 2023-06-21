import { upperCase } from "./utils";
const arr = [
  'uid',
  'start_time',
  'end_time',
  'item_class_id',
  'page_size',
  'offset',
  'export',
]

function main() {

  let text = `message GetListREQ {
    `;
    arr.forEach((x, idx) => {
      let type = "string"
      if (
        x.toLocaleLowerCase().endsWith("id") ||
        x.toLocaleLowerCase().endsWith("time")
      ) {
        type = "int64"
      }
      

      text += `  // @gotags: json:"${x}"
      ${type} ${upperCase(x)} = ${idx + 1} [json_name = "${x}"];
    `;
      });
      text += `  // @gotags: json:"ds"
      int32 Ds = 9 [json_name = "ds"];
}`;
    
      console.log(text);
}

main()