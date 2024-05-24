
import slugify from "slugify";
import cloudinary from "../../services/cloudinary.js";
import categoryModel from '../../../DB/model/category.model.js'
import { pagination } from "../../services/pagination.js";
import productModel from "../../../DB/model/product.model.js";
import subcategoryModel from "../../../DB/model/subcategory.model.js";
import { sendEmail } from "../../services/email.js";
import { createNotification } from "../notification/notification.js";

export const getCategories = async (req, res) => {

    const { skip, limit } = pagination(req.query.page, req.query.limit);
    const categories = await categoryModel
      .find()
      .skip(skip)
      .limit(limit)
      .populate("subcategory");
    return res.status(200).json({ message: "success", categories });
  };
export const createCategories= async(req,res)=>{
    const name=req.body.name.toLowerCase();
    if(await categoryModel.findOne({name})){
        return res.status(409).json({message:"category name already exists"})
    }


    const {secure_url,public_id} =await cloudinary.uploader.upload(req.file.path,{
        folder: `${process.env.APP_NAME}/category`
    });
const cat=await categoryModel.create({name,slug:slugify(name),image:{secure_url,public_id},createdBy:req.user._id,updateBy:req.user._id})

   // إرسال إشعار بنجاح إنشاء الفئة
   const title = "New Category Created";
   const content = `A new category "${name}" has been created.`;
   const userId = req.user._id; 

   await createNotification({ title, content, userId });

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


export const getActiveCategory = async (req, res) => {

    const { skip, limit } = pagination(req.query.page, req.query.limit);
    const categories = await categoryModel
      .find({ status: "Active" })
      .skip(skip)
      .limit(limit)
      .select("name image");
    return res
      .status(200)
      .json({ message: "success", count: categories.length, categories });
  };

  export const deleteCategory = async (req, res, next) => {
    const { categoryId } = req.params;
    const category = await categoryModel.findByIdAndDelete(categoryId);
    if (!category) {
      return next(new Error(`category not found`, { cause: 404 }));
    }
    await productModel.deleteMany({ categoryId });
    await subcategoryModel.deleteMany({ categoryId });
    return res.status(200).json({ message: "success" });
  };


