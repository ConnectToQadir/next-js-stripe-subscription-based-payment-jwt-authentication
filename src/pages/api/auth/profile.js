import dbConnect from "@/backend/dbConnect";
import {UsersModel} from "@/backend/models";
import { JWTVerify } from "@/backend/helpers/jwt";

export default async function handler(req, res) {
  await dbConnect();

  try {
    var token = req.cookies.AccessToken || "";
    var userID = await JWTVerify(token);
   
    const foundUser = await UsersModel.findById(userID, { password: false });

    if (!foundUser) {
      res.status(400).json({
        success: false,
        message: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: foundUser,
    });


  } catch (error) {
    if (error.kind == "ObjectId") {
      res.status(400).json({
        success: false,
        message: null,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
