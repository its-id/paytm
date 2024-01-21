import express from 'express';
import { z } from 'zod';
import dotenv from 'dotenv';

import { createUserSchema, signInUserSchema } from '../schema/user.js';
import { User } from '../db/user.js';
import userMiddleware from '../middleware/auth.js';
import { Account } from '../db/account.js';

const accountRouter = express.Router();

dotenv.config();

accountRouter.post('/balance', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Balance',
  });
});

accountRouter.post('/transfer', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Transfer',
  });
});

export default accountRouter;
