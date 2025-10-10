let data = [
  13515, 1546, 1, 6485, 464, 8, 651, 21, 51, 132, 1, 58, 48, 84, 8, 46, 48, 4,
  468, 468,
];

function revwithassdesc(data) {
  let showddata = [];

  for (let a = data.length - 1; a >= 0; a--) {
    console.log("first - ", data[a]);
    showddata.push(data[a]);
  }

  showddata.sort((maindata, mydata) => maindata - mydata);
  console.log("second", showddata);

  showddata.sort((maindata, mydata) => mydata - maindata);
  console.log("Third", showddata);

  return showddata;
}

let res = revwithassdesc(data);
