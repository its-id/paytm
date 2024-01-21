import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.DB_URL);

const AccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  //we don't store the balances in type FLOAT cause of precision issues in DB.
  balance: {
    type: Number,
    required: true,
  },
});

export const Account = mongoose.model('account', AccountSchema);
