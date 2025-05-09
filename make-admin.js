// make-admin.js - Script to promote a user to admin
const mongoose = require('mongoose');
require('dotenv').config();

// The email of the user you want to make an admin
const targetEmail = 'emtiaz.ahmed@g.bracu.ac.bd'; // Change this to the email you want to make admin

async function makeAdmin() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    // Create a User model
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      role: String
    }), 'users');

    // Update the user's role to admin
    const result = await User.updateOne(
      { email: targetEmail },
      { role: 'admin' }
    );

    if (result.matchedCount === 0) {
      console.log(`No user found with email: ${targetEmail}`);
    } else if (result.modifiedCount === 0) {
      console.log(`User with email ${targetEmail} is already an admin`);
    } else {
      console.log(`Successfully updated user ${targetEmail} to admin role`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

makeAdmin(); 