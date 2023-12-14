import jwt from "jsonwebtoken"
import userModel from "../../DB/model/user.model.js";
export const roles={
  Admin:'Admin',User:'User'
}

export const auth=(accessRoles=[])=>{
    return async(req,res,next)=>{
        const{authorization}=req.headers; 
        if(!authorization?.startsWith(process.env.BEARERKEY))
        return res.status(400).json({message:"invalid authorization"})
   const token=authorization.split(process.env.BEARERKEY)[1]
   const decoded=jwt.verify(token,process.env.LOGINSECRET)
   
   if(!decoded)
   return res.status(400).json({message:"invalid authorization"})
const user= await userModel.findById(decoded.id).select("userName role")
   if(!user)
     return res.status(400).json({message:"not registred user"})
   

   if(!accessRoles.includes(user.role)){
    return res.status(403).json({message:"not auth user"})

   }
  req.user=user;
     next();
    }
   
}