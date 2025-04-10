let data = ["sdvsf efwef da sdsv sd vdav s wef zdcv sdvsv ewfef ds"];

let result = data[0]
  .split(" ")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");
console.log(result);
