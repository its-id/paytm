import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { Schema } = mongoose;

mongoose.connect(process.env.DB_URL);

const AccountsSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

export const Accounts = mongoose.model('account', AccountsSchema);
