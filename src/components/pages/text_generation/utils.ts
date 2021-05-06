export function getStringByIndex(
  index: number,
  obj: { [key: string]: number }
) {
  return Object.keys(obj).filter(function (key) {
    return obj[key] === index;
  })[0];
}

export function padSequence(arr: any[], length: number): any[] {
  let newArr: string[] = Array(Math.max(0, length - arr.length)).fill(0);
  arr.forEach((a) => newArr.push(a));
  return newArr;
}

export function getIndexFromString(
  str: string,
  obj: { [key: string]: number }
): number[] {
  const sList = str.split(" ");

  return sList.map((s) => obj[s] ?? 0);
}
