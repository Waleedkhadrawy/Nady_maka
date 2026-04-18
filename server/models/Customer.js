const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: false, lowercase: true, trim: true },
    phone: { type: String, required: false, trim: true },
    membershipType: { type: String, required: false, trim: true },
    joinDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    partner: {
      name: { type: String },
      relation: { type: String },
      birthDate: { type: Date },
      nationalId: { type: String },
      phone: { type: String },
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', CustomerSchema);
