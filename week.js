const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function writeFile(users) {
  try {
    fs.writeFileSync('users.json', JSON.stringify(users,2));
    console.log('Data has been written to users.json');
  } catch (err) {
    console.error(err); 
  }
}

async function readFile() {
  try {
    const data = await fs.promises.readFile('users.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return [];
  }
}

function login() {
  rl.question('Enter name: ', (name) => {
    rl.question('Enter pin: ', (pin) => {
      readFile().then((users) => {
        const user = users.find((user) => user.name === name && user.pin === parseInt(pin));
        if (user) {
          console.log('Welcome', name);
          rl.question('Enter 1 for Checking Balance, 2 for Depositing Money, and 3 for Withdrawing Money, and 4 for historique transaction: ', (choice) => {
            if (choice === '1') {
              console.log(`Your balance is ${user.balance}`);
              rl.close();
            } else if (choice === '2') {
              const action = 'deposit';
              rl.question(`Enter the amount for ${action}: `, (amount) => {
                const AmountDeposit = parseFloat(amount);
                if (isNaN(AmountDeposit) || AmountDeposit <= 0) {
                  console.log('Invalid amount. Please enter a valid number greater than 0.');
                  rl.close();
                  return;
                }
                const newTransaction = { type: action, amount: AmountDeposit ,date: new Date()};
                user.transactions.push(newTransaction);
                user.balance = user.balance+AmountDeposit;
                writeFile(users);
                console.log(`${action} successful. Your new balance is ${user.balance}`);
                rl.close();
              });
            } else if (choice === '3') {
              const action = 'withdraw';
              rl.question(`Enter the amount for ${action}: `, (amount) => {
                const AmountWithdraw = parseFloat(amount);
                if (isNaN(AmountWithdraw) || AmountWithdraw <= 0) {
                  console.log('Invalid amount. Please enter a valid number greater than 0.');
                  rl.close();
                  return;
                }
                if (AmountWithdraw > user.balance) {
                  console.log('Insufficient balance.');
                  rl.close();
                  return;
                }
                const newTransaction = { type: action, amount: AmountWithdraw,date: new Date() };
                user.transactions.push(newTransaction);
                user.balance =user.balance- AmountWithdraw;
                writeFile(users);
                console.log(`${action} successful. Your new balance is ${user.balance}`);
                rl.close();
              });
            }else if (choice === '4') {
              users.forEach(user => {
                  console.log(`Transactions for ${user.name}:`);
                  user.transactions.forEach(transaction => {
                      console.log(`Type: ${transaction.type}, Amount: ${transaction.amount}`);
                  });
              });
          
          

            } else {
              console.log('Invalid choice');
              rl.close();
            }
          });
        } else {
          console.log('Incorrect name or pin');
          rl.close();
        }
      });
    });
  });
}

function add() {
  rl.question('Enter name: ', (name) => {
    readFile().then((users) => {
      const accountID = users ? users.length + 1 : 1;
      const pin = Math.floor(Math.random() * 9000) + 1000;
      const newUser = { accountID, name, pin, balance: 0, transactions: [] };
      if (users) {
        users.push(newUser);
        writeFile(users);
      } else {
        writeFile([newUser]);
      }
      console.log('User added successfully');
      rl.close();
    });
  });
}

function allMethod() {
  rl.question('Enter 1 to log in, 2 to add user: ', (choice) => {
    if (choice === '1') {
      login();
    } else if (choice === '2') {
      add();
    } else {
      rl.close();
    }
  });
}

allMethod();