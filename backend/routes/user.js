import express from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import {
  createUserSchema,
  signInUserSchema,
  updateUserSchema,
} from '../schema/user.js';
import userMiddleware from '../middleware/auth.js';
import { User } from '../db/user.js';
import { Account } from '../db/account.js';

const userRouter = express.Router();
dotenv.config();

userRouter.post('/signup', async function (req, res) {
  const { email, password, firstName, lastName } = req.body;
  const { success } = createUserSchema.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      success: false,
      error: 'Email already taken / Incorrect inputs',
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(411).json({
        success: false,
        error: 'Email already taken / Incorrect inputs',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await Account.create({
      userId: user._id,
      balance: 1 + Math.floor(Math.random()) * 10000,
    });

    return res.status(200).json({
      success: true,
      userId: user._id,
      message: 'Signed up Successfully!',
    });
  } catch (err) {
    console.log(err);
    throw new Error();
  }
});

userRouter.post('/signin', async (req, res) => {
  try {
    const { success } = signInUserSchema.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        success: false,
        message: 'Incorrect inputs',
      });
    }

    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return response.status(401).json({
        success: false,
        message: 'User does not exist!',
      });
    }

    const passwordValidates = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (passwordValidates) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '5h', // expires in 1h
      });

      return res.status(200).json({
        success: true,
        token: token,
        message: 'Signed in successfully!',
      });
    }

    return res
      .status(401)
      .json({ success: false, message: 'Wrong username/password' });
  } catch (err) {
    console.log(err);
    throw new Error();
  }
});

userRouter.put('/', userMiddleware, async (req, res) => {
  try {
    const { success } = updateUserSchema.safeParse(req.body);

    if (!success) {
      res.status(411).json({
        message: 'Error while updating information',
      });
    }

    await User.findByIdAndUpdate({ _id: req.userId }, req.body);

    return res
      .status(200)
      .json({ success: true, message: 'User Details updated successfully!' });
  } catch (err) {
    console.log(err);
    throw new Error();
  }
});

userRouter.get('/bulk', async (req, res) => {
  const filter = req.query.filter || '';

  try {
    const users = await User.find({
      //either firstName OR lastName contains the SUBSTRING present in filter, we return it.
      $or: [
        { firstName: { $regex: filter, $options: 'i' } }, //$options: 'i' means case insensitive
        { lastName: { $regex: filter, $options: 'i' } },
      ],
    });

    res.json({
      user: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (err) {
    console.log(err);
    throw new Error();
  }
});

export default userRouter;
