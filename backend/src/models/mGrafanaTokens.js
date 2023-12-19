import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const schema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  },
  token: { type: String, required: true },
});

export const GrafanaTokens = model('GrafanaTokens', schema, 'GrafanaTokens');
