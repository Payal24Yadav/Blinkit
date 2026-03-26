import jwt from 'jsonwebtoken'

export const auth =async(req,res,next)=>{
    try{
        const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1]
        console.log('token', token);
        if(!token){
            return res.status(401).json({
                messsage: "Provide token"
            })
        }
        
        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)

        console.log(decode);
        
        if(!decode){
            return res.status(401).json({
                message: "unauthorized access",
                error:true,
                success:false
            })
        }

        req.userId=decode.id;
        next()
    } catch(error){
        return res.status(500).json({
            message:"You have not Login", //error.message || error,
            error:true,
            success:false
        })
    }
}