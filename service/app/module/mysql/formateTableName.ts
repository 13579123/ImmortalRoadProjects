export function formateTableName(tn: string): string {
  let result = ""
  const char_arr = tn.split("")
  char_arr.forEach((char , i) => {
    if (i === 0) result += char.toLowerCase()
    else {
      const temp = char
      const lowTemp = char.toLowerCase()
      if (temp === lowTemp) result += lowTemp
      else result += "_" + char.toLowerCase()
    }
  })
  return result
}

export function fieldToClassName(tn: string): string {
  let result = ""
  const str_arr = tn.split("_")
  result += str_arr[0]
  for (let i = 1; i < str_arr.length; i++) {
    const char_arr = str_arr[i].split("")
    if(char_arr[0]) char_arr[0] = char_arr[0].toUpperCase()
    result += char_arr.join("")
  }
  return result
}