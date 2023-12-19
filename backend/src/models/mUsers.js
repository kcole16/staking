import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const schema = new Schema({
  email: { type: String, unique: true },
  password: { type: String },
  isVerified: { type: Boolean, default: false },
});

export const Users = model('Users', schema, 'Users');
