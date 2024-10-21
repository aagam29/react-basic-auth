import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gqlClient from "../graphql/gqlClient.js";
import {
  CreateNextUserMutation,
  GetUserByEmailQuery,
} from "../graphql/mutations.js";

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

class AuthService {
  async signup(signupRequest) {
    const { email, password, firstname, lastname } = signupRequest;
    const hashedPassword = await bcrypt.hash(password, 8);
    const userData = {
      email,
      password: hashedPassword,
      firstname,
      lastname,
    };
    const response = await gqlClient.request(CreateNextUserMutation, {
      userData,
    });
    if (!response?.createNextUser) {
      throw new Error("CreateUser Failed");
    }
    const token = jwt.sign({ user: response.createNextUser }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    return { user: response.createNextUser, token };
  }

  async signin(email, password) {
    const getUserResponse = await gqlClient.request(GetUserByEmailQuery, {
      email,
    });
    const { nextUser } = getUserResponse;
    if (!nextUser) {
      throw new Error("Invalid Email Or Password");
    }
    const isMatch = await bcrypt.compare(password, nextUser.password);
    if (!isMatch) {
      throw new Error("Invalid Email Or Password");
    }
    const token = jwt.sign(
      {
        id: nextUser.id,
        email: nextUser.email,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    return token;
  }

  async getCurrentUser(token) {
    const decoded = jwt.verify(token, JWT_SECRET);
    const getUserResponse = await gqlClient.request(GetUserByEmailQuery, {
      email: decoded.email,
    });
    const { nextUser } = getUserResponse;
    if (!nextUser) {
      throw new Error("User not found");
    }
    delete nextUser.password;
    return nextUser;
  }
}

export default AuthService;
