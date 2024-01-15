import couponModel from "../../../DB/model/coupon.model.js"

export const createCoupon=async (req,res)=>{
   const{name,amount}=req.body
   req.body.expireDate = new Date(req.body.expireDate);
   if(await couponModel.findOne({name})){
    return res.status(409).json({message:"coupn name already exist",coupon})
}
const coupon=await couponModel.create(req.body)
return res.status(201).json({message:"success",coupon})

}

export const getCoupon=async(req,res)=>{
    const coupon =await couponModel.find({isDeleted: false})
    return res.status(200).json({message:"success",coupon})

 }

 export const updateCoupon= async(req,res)=>{
   const coupon =await couponModel.findById(req.params.id)
 if(!coupon){
    return res.status(409).json({message:'copun not found'})
 }
if(req.body.name){
    if(await couponModel.findOne({name:req.body.name}).select('name')){
        return res.status(409).json({message:`coupon ${req.body.name} already exist`})

    }

coupon.name=req.body.name;
}
if(req.body.amount){
    coupon.amount=req.body.amount;
}
await coupon.save();
return res.status(200).json({message:"success",coupon})

}

export const softDelete= async(req,res)=>{

    const {id}=req.params
    const coupon =await couponModel.findOneAndUpdate({_id:id,isDeleted:false},
        {isDeleted:true},
        {new:true});
    if(!coupon){
        return res.status(409).json({message:'can not delete this coupun'})
     }
     return res.status(409).json({message:'success'})
    }

export const hardelete= async(req,res)=>{
    const {id}=req.params
    const coupon =await couponModel.findOneAndDelete({_id:id})
    if(!coupon){
        return res.status(409).json({message:'can not delete this copun'})
     }
     return res.status(409).json({message:'success'})
 
}


export const restore= async(req,res)=>{
    const {id}=req.params
    const coupon =await couponModel.findOneAndUpdate({_id:id,isDeleted:true},
        {isDeleted:false},
        {new:true});
    if(!coupon){
        return res.status(400).json({message:'can not restore this copun'})
     }
     return res.status(409).json({message:'success'})
 
}