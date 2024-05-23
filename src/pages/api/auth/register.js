import dbConnect from "@/backend/dbConnect";
import { GenAccessToken } from "@/backend/helpers/jwt";
import { UsersModel } from "@/backend/models";
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import Stripe from "stripe";

export default async function handler(req, res) {
  await dbConnect();
  try {
    if (req.method != "POST") {
      return res.json({
        success: false,
        message: "Method Not Allowed!",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    var newUserData = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
    };

    var createdUser = await UsersModel.create(newUserData);

    if (createdUser) {
      try {
        // After User Creation also create a new cusotmer in stripe
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: "2022-11-15",
        });
        var stripeCustomer = await stripe.customers.create({
          email: createdUser.email,
          name: createdUser.fullName,
        });
        // updating stripeCusotmerID of the user
        createdUser = await UsersModel.findByIdAndUpdate(createdUser._id, {
          $set: { stripeCustomerId: stripeCustomer.id },
        });
      } catch (error) {

        await UsersModel.findByIdAndDelete(createdUser._id);

        return res.status(500).json({
          success: false,
          message: "Error while Registering a Stripe Customer!",
        });
      }
    }

    // Generating Access Token
    const AccessToken = await GenAccessToken({
      id: createdUser._id,
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
      message: "Your are Registered Successfully!",
      data: createdUser,
    });
  } catch (err) {
    // For duplication Error
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: `${Object.keys(err.keyPattern)[0]} is already in used!`,
      });
    }

    // required fields error handling
    var requiredFildName = Object?.keys(err?.errors)[0];

    if (requiredFildName) {
      return res.status(400).json({
        success: false,
        message: `${requiredFildName} is required!`,
      });
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
