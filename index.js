const readline = require('readline');

// Create the readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const data = [];

function add() {
  rl.question('What name: ', (name) => {
    rl.question('What is your number: ', (tele) => {
      const newData = { name, tele };
      data.push(newData);
      console.log(`Hello ${name}, your number is ${tele}`);
      allmethod();
    });
  });
}

function view() {
  if (data.length === 0) {
    console.log('No data here');
  } else {
    data.forEach((item, index) => {
      console.log(`Data ${index}: ${item.name}, ${item.tele}`);
    });
  }
  allmethod();
}

function searchData(searchName) {
  const searchData = data.filter((item) => searchName === item.name);
  if (searchData.length > 0) {
    searchData.map((item, index) => {
      console.log(`Data ${index}: ${item.name}, ${item.tele}`);
    });
  } else {
    console.log('No matching name found');
  }
  allmethod();
}

function allmethod() {
  rl.question('Enter 1 to add, 2 to view all, and 3 to search: ', (choix) => {
    if (choix === '1') {
      add();
    } else if (choix === '2') {
      view();
    } else if (choix === '3') {
      rl.question('Enter the name to search: ', (search) => {
        searchData(search); 
      });
    } else {
      rl.close();
    }
  });
}

allmethod();
