import mongoose from "mongoose"


export default async function dbConnect(){
    try {
        if(mongoose.connection.readyState >= 1){
            return
        }
        await mongoose.connect(process.env.DB_URI)
    } catch (error) {
        return false
    }
}