// Import the bcrypt library
const bcrypt = require('bcrypt');

// Function to hash a password
async function hashPassword(password) {
  const saltRounds = 10; // Number of salt rounds
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Hashed Password:', hashedPassword);
    return hashedPassword;
  } catch (err) {
    console.error('Error hashing password:', err);
  }
}

// Function to check a password
async function checkPassword(plainPassword, hashedPassword) {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    if (match) {
      console.log('Password matches!');
    } else {
      console.log('Password does not match.');
    }
    return match;
  } catch (err) {
    console.error('Error checking password:', err);
  }
}

// Example usage
async function main() {
  const password = 'mysecretpassword';
  const hashedPassword = await hashPassword(password);
  
  // Later, to check the password
  const isMatch = await checkPassword('mysecretpassword', hashedPassword);
  console.log('Password is valid:', isMatch);
}

main();
