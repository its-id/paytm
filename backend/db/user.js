import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { Schema } = mongoose;

mongoose.connect(process.env.DB_URL);

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  firstName: String,
  lastName: String,
  password: String,
});

export const User = mongoose.model('user', UserSchema);
