import {UsersModel} from "@/backend/models";
import dbConnect from "@/backend/dbConnect";
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { GenAccessToken } from "@/backend/helpers/jwt";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
      return;
    }

    const foundUser = await UsersModel.findOne({ email });

    if (!foundUser) {
      res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Compare provided password with hashed password
    const IspasswordValid = await bcrypt.compare(
      req.body.password,
      foundUser.password
    );

    if (!IspasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid Credentials!",
      });
      return;
    }

    // Generating Access Token
    const AccessToken = await GenAccessToken({
      id: foundUser._id,
    });

    // setting Cookies
    res.setHeader(
      "Set-Cookie",
      serialize("AccessToken", AccessToken, {
        path: "/",
        httpOnly: true,
      })
    );

    res.status(201).json({
      success: true,
      message: "User Login Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
