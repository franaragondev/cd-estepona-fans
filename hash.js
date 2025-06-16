const bcrypt = require("bcrypt");

const password = process.argv[2];

bcrypt.hash(password, 12).then((hash) => {
  console.log(`Hash: ${hash}`);
});
