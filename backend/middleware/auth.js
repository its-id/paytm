import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const userMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(411).json({ error: 'Some error occurred' });
  }
};

export default userMiddleware;
