import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import gqlClient from '../graphql/gqlClient.js';
import { CreateNextUserMutation, GetUserByEmailQuery } from '../graphql/mutations.js';
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
const router = express.Router();

// THIS IS FOR DEMO PURPOSE
// IDEALLY YOU SHOULD BE SPLITTING UP ROUTES, CONTROLLERS, SERVICES.

//SIGN UP API
router.post('/auth/signup', async (req, res) => {
  try {
    const {
      email, password, firstname, lastname,
    } = req.body;
    if (!email || !password || !firstname || !lastname) {
      res.status(400).end();
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const userData = {
      email,
      password: hashedPassword,
      firstname,
      lastname,
    };
    const response = await gqlClient.request(CreateNextUserMutation, { userData });
    if (!response?.createNextUser) {
      console.log('CreateUser Failed, Response: ', response);
      res.status(400).end()
    }
    const token = jwt.sign({ user: response.createNextUser }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.send({ user: response.createNextUser, token });
  } catch (err) {
    console.log('POST auth/signup, Something Went Wrong: ', err);
    res.status(400).send({ error: true, message: err.message });
  }
});

//SIGN IN API
router.post('/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).end();
      return;
    }
    const getUserResponse = await gqlClient.request(GetUserByEmailQuery, { email });
    const { nextUser } = getUserResponse;
    if (!nextUser) {
      res.status(400).json({ msg: 'Invalid Email Or Password' });
      return;
    }
    const { password: hashedPassword } = nextUser;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      res.status(400).json({ msg: 'Invalid Email Or Password' });
      return;
    }
    const token = jwt.sign({
      id: nextUser.id,
      email: nextUser.email
    },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    res.status(200).json({ token });
  } catch (err) {
    console.log('POST auth/signin, Something Went Wrong: ', err);
    res.status(400).send({ error: true, message: err.message });
  }
})

// GET USER FROM TOKEN API
router.get('/auth/me', async (req, res) => {
  const defaultReturnObject = { authenticated: false, user: null };
  try {
    const token = String(req?.headers?.authorization?.replace('Bearer ', ''));
    const decoded = jwt.verify(token, JWT_SECRET);
    const getUserResponse = await gqlClient.request(GetUserByEmailQuery, { email: decoded.email });
    const { nextUser } = getUserResponse;
    if (!nextUser) {
      res.status(400).json(defaultReturnObject);
      return;
    }
    delete nextUser.password
    res.status(200).json({ authenticated: true, user: nextUser });
  }
  catch (err) {
    console.log('POST auth/me, Something Went Wrong', err);
    res.status(400).json(defaultReturnObject);
  }
})

export default router;
