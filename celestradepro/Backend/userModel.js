const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// userModel.js

let userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    theme: { type: String, default: 'light' },
    watchlist: { type: Array, default: [] },
    selectedSections: { type: [String], default: [] }  // Array to store selected sections
  },
  {
    collection: 'Users',
  }
);

module.exports = mongoose.model('User', userSchema);

