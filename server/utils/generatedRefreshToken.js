import UserModel from "../model/user-model.js"
import jwt from "jsonwebtoken"
export const generatedRefreshToken = async(userId)=>{
    const token= jwt.sign({ id: userId }, process.env.SECRET_KEY_REFRESH_TOKEN, { expiresIn: '5d' })
    const updateRefreshTokenUser = await UserModel.updateOne(
        {_id:userId},
        {
            refresh_token:token
        }
    )
    return token
}