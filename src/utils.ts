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