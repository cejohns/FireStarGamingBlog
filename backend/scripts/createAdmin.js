// public/createAdmin.js
// Usage: node createAdmin.js <username> <email> <password>
// This script connects to your MongoDB and creates an admin user.

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

async function main() {
  const [,, username, email, password] = process.argv;
  if (!username || !email || !password) {
    console.error('Usage: node createAdmin.js <username> <email> <password>');
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.error('⚠️ A user with that email already exists.');
      process.exit(1);
    }

    // Hash the password
    const hashed = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = new User({ username, email, password: hashed, role: 'admin' });
    await admin.save();

    console.log(`✅ Admin user created: ${username} <${email}>`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
}

main();
