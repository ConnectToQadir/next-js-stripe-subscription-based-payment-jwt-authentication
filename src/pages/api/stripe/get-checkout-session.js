import { JWTVerify } from "@/backend/helpers/jwt";
import Stripe from "stripe";
import {UsersModel} from '@/backend/models'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2022-11-15",
});


export default async function handler(req,res){

try {

    var stripePriceID = req.query.stripePriceID

    var token = req.cookies.AccessToken || "";
    var userID = await JWTVerify(token)
   
    const foundUser = await UsersModel.findById(userID, { password: false });

    if (!foundUser) {
      res.status(400).json({
        success: false,
        message: null,
      });
      return;
    }

    const checkoutSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: foundUser.stripeCustomerId,
        line_items: [
            {
                price: stripePriceID,
                quantity: 1,
            },
        ],
        success_url:process.env.NEXT_PUBLIC_DOMAIN + "/",
        cancel_url: process.env.NEXT_PUBLIC_DOMAIN + "/plans",
    });


    return res.json({
        success:true,
        message:"Session Created Successfully!",
        data:{
            sessionId:checkoutSession.id,
            checkoutUrl:checkoutSession.url
        }
    })

} catch (error) {
    res.status(500).json({
        success:false,
        message:error?.message || "Something went wrong, Please try again later!"
    })
}

}