
import slugify from "slugify";
import cloudinary from "../../services/cloudinary.js";
import categoryModel from '../../../DB/model/category.model.js'

export const getCategories= async(req,res)=>{
    const categories=await categoryModel.find().populate('subCategory');
    return res.status(200).json({messages:"success",categories})
}

export const createCategories= async(req,res)=>{
    const name=req.body.name.toLowerCase();
    if(await categoryModel.findOne({name})){
        return res.status(409).json({message:"category name already exists"})
    }


    const {secure_url,public_id} =await cloudinary.uploader.upload(req.file.path,{
        folder: `${process.env.APP_NAME}/category`
    });
const cat=await categoryModel.create({name,slug:slugify(name),image:{secure_url,public_id},createdBy:req.user._id,updateBy:req.user._id})
return res.status(201).json({message:"success",cat})
}
// slug: مشان يحط - بدل الفراغ بين الكلمات


export const getspecificCategory= async(req,res)=>{
    const {id}=req.params;
    const category=await categoryModel.findById(id);
    return res.status(200).json({messages:"success",category})
}

export const updateCategory= async(req,res)=>{
// return res.json(req.params.id)
try{
const category=await categoryModel.findById(req.params.id);
if(!category)
return res.status(404).json({message:`invalid category id ${req.params.id}`})

if(req.body.name){
    if(await categoryModel.findOne({name:req.body.name}).select('name')){
        return res.status(409).json({message:`category ${req.body.name} already exist`})
    }
    category.name=req.body.name;
    category.slug=slugify(req.body.name);
}
if(req.body.status){
    category.status=req.body.status;
}
if(req.file){
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category`})
  await cloudinary.uploader.destroy(category.image.public_id)
    category.image={secure_url,public_id};
}

await category.save()
return res.status(200).json({message:"success"});

}catch(err){
return res.status(500).json({message:"error",err:err.stack});
    
}
};


export const getAciveCategory= async(req,res)=>{
    try{
        const category=await categoryModel.find({status:'Active'}).select('name')
     return res.status(200).json({message:"success",category})
    }catch(err){
        return res.json({message:"error",err:err.stack});
    }    
}