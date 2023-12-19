import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const schema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '1d' },
});

export const Tokens = model('Tokens', schema, 'Tokens');
