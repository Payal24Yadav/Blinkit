import UserModel from "../model/user-model.js";
export const admin = async (req, res, next)=>{
    try{
        const userId = req.userId
        const user = await UserModel.findById(userId)

        if (!user || user.role !== "admin"){
            return res.status(400).json({
                message: "Permission denial",
                error: true,
                success: false
            })
        }
        next()
    } catch(error){
        return res.status(500).json({
            message:"Permission denial",
            error: true,
            success: false
        })
    }
}