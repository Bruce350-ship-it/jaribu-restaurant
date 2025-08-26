/*
const bcrypt = require('bcryptjs');

const input = 'john';
const storedHash = '$2b$10$NoYKDBWUpZSnQuFRcvEv1.7jKtWcbvnHW3JUM1nIQgFeUVU9COKXS';

bcrypt.compare(input, storedHash).then(result => {
  console.log('Match?', result); // ✅ Should print: Match? true
});
*/

const bcrypt = require('bcryptjs');

const password = 'bruce';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) throw err;
  console.log(hash); // This is the hashed password
});

/*
const bcrypt = require('bcryptjs');

const password = 'bruce';
const saltRounds = 12;

console.time('Hashing');
bcrypt.hash(password, saltRounds, function(err, hash) {
  console.timeEnd('Hashing'); // Displays how long hashing took // Hashing: 280.063ms
});
*/