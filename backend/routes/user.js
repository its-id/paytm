import express from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import dotenv from 'dotenv';

import { createUserSchema, signInUserSchema } from '../schema/user.js';
import { User } from '../db/user.js';
import userMiddleware from '../middleware/auth.js';
const userRouter = express.Router();
dotenv.config();

userRouter.post('/signup', async function (req, res) {
  const { username, email, password, firstName, lastName } = req.body;
  const { success } = z.safeParse(createUserSchema);

  if (!success) {
    return res.status(411).json({
      error: 'Email already taken / Incorrect inputs',
    });
  }

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    return res.status(411).json({
      error: 'Email already taken / Incorrect inputs',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });

  await user.save();
  try {
    res.status(200).json({
      userId: 'userId of newly added user',
    });
  } catch (err) {
    console.log(err);
    const error = new Error('Error! Something went wrong.');
    return next(error);
  }
});

userRouter.post('/signin', async (req, res) => {
  const { success } = signInUserSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: 'Incorrect inputs',
    });
  }

  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET
    );

    res.json({
      token: token,
    });
    return;
  }
  return res.status(411).json({ message: 'Error while logging in' });
});

userRouter.put('/', userMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);

    if (!success) {
      res.status(411).json({
        message: 'Error while updating information',
      });
    }

    await User.updateOne(req.body, {
        id: req.userId
    })
})

userRouter.get('/bulk', async (req, res) => {
  const filter = req.query.filter || '';

  const users = await User.find({

    //either firstName OR lastName contains the SUBSTRING present in filter, we return it.
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
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
});

export default userRouter;
