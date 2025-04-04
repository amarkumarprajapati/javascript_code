let data = [112, 12, 3, 5, 6, 4, 5, 5, 5, 1, 5];

function finddublicate(data) {
  let dublicatedata = [];
  let sortedarr = data.slice().sort((a, b) => a - b);
  for (let a = 0; a < sortedarr.length - 1; a++) {
    if (sortedarr[a + 1] === sortedarr[a]) {
      dublicatedata.push(sortedarr[a]);
    }
  }
  return dublicatedata;
}

let res = finddublicate(data);
console.log(res);
