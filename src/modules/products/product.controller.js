import slugify from "slugify";
import categoryModel from "../../../DB/model/category.model.js";
import subcategoryModel from "../../../DB/model/subcategory.model.js";
import cloudinary from "../../services/cloudinary.js";
import productModel from "../../../DB/model/product.model.js";
import { pagination } from "../../services/pagination.js";
import { createNotification } from "../notification/notification.js"
import userModel from "../../../DB/model/user.model.js";

export const getProducts = async(req,res)=>{
    const {skip,limit} = pagination(req.query.page,req.query.limit);
  
    let queryObj={...req.body};
    const execQuery=['page','limit','skip','sort','search'];
    execQuery.map((ele)=>{
  delete queryObj[ele];
  
    });
    queryObj=JSON.stringify(queryObj);
    queryObj=queryObj.replace(/\b(gt|gte|lt|lte|in|nin|eq|neq)\b/g,match=>`$${match}`);
    queryObj=JSON.parse(queryObj);
    const mongooseQuery=productModel.find(queryObj).limit(limit).skip(skip);
    if(req.query.search){
      mongooseQuery.find({
        $or:[
          {name:{$regx:req.query.search,$options:'i'}},
          {description:{$regx:req.query.search,$option:'i'}},
        ]
      })
      mongooseQuery.select('name mainImage');
    }
   
    const products=await mongooseQuery.sort(req.query.sort?.replaceAll(',',' '));
    const count=await productModel.estimatedDocumentCount();
    return res.json({message:"success",page:products.length,total:count,products});
  }

  export const createProduct = async(req,res)=>{
    const { name, price, discount, categoryId, subcategoryId } = req.body;
  
    const checkCategory = await categoryModel.findById(categoryId);
    if (!checkCategory) {
        return res.status(404).json({ message: "category not found" });
    }
  
    const checksubCategory = await subcategoryModel.findById(subcategoryId);
    if (!checksubCategory) {
        return res.status(404).json({ message: "sub category not found" });
    }
  
    req.body.slug = slugify(name);
    req.body.finalPrice = (price - ((price * (discount || 0)) / 100)).toFixed(2);
  
    const { public_id, secure_url } = await cloudinary.uploader.upload(
        req.files.mainImage[0].path,
        { folder: `${process.env.APP_NAME}/product/${req.body.name}/mainImage` }
    );
    req.body.mainImage = { public_id, secure_url };
    req.body.subImages = [];
    for (const file of req.files.subImages) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(
            file.path,
            { folder: `${process.env.APP_NAME}/product/${req.body.name}/subImages` }
        );
        req.body.subImages.push({ public_id, secure_url });
    }
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;
  
    const product = await productModel.create(req.body);
    if (!product) {
        return res.status(400).json({ message: "error while creating product" });
    }
   
    return res.status(201).json({ message: "success", product });
};


export const getProductWithCategory = async (req, res) => {
    const products = await productModel.find({
      categoryId: req.params.categoryId,
    });
    return res.status(200).json({ message: "success", products });
  };


  export const getProduct = async (req, res) => {
    const product = await productModel.findById(req.params.productId);
    return res.status(200).json({ message: "success", product });
  };

  export const filterProducts = async (req, res) => {
    const { skip, limit } = pagination(req.query.page, req.query.limit);
    
    let queryObj = {};
  
    if (req.query.price) {
      const [minPrice, maxPrice] = req.query.price.split('-').map(Number);
      queryObj.price = { $gte: minPrice, $lte: maxPrice };
    }
  
    if (req.query.color) {
      queryObj.colors = req.query.color;
    }
  
    const mongooseQuery = productModel.find(queryObj).limit(limit).skip(skip);
  
    if (req.query.sort) {
      mongooseQuery.sort(req.query.sort.replaceAll(',', ' '));
    }
  
    const products = await mongooseQuery;
    const count = await productModel.countDocuments(queryObj);
    return res.json({ message: "success", page: products.length, total: count, products });
  };
  
  export const getDeals = async (req, res) => {
    const { skip, limit } = pagination(req.query.page, req.query.limit);
    
    const deals = await productModel.find({ discount: { $gt: 0 } }).limit(limit).skip(skip);
    const count = await productModel.countDocuments({ discount: { $gt: 0 } });
    
    return res.status(200).json({ message: 'success', page: deals.length, total: count, deals });
  };
  

// export const updateProduct = async (req, res) => {
//     // قم بتحديث المنتج
//     const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });

//     // تحقق مما إذا كان المنتج موجودًا في قائمة المفضلة لأي مستخدم
//     const usersWithFavoriteProduct = await userModel.find({ favoriteProducts: req.params.productId });

//     // إرسال إشعارات إلى المستخدمين الذين لديهم المنتج في قائمة المفضلة
//     for (const user of usersWithFavoriteProduct) {
//         const title = "تم تحديث المنتج المفضل لديك";
//         const content = `تم تحديث المنتج ${updatedProduct.name}`;
//         const userId = user._id;
//         await createNotification({ title, content, userId });
//     }

//     res.status(200).json({ message: "تم تحديث المنتج بنجاح", updatedProduct });
// };



export const updateProduct= async(req,res)=>{
  // return res.json(req.params.id)
  try{ 
  const product=await productModel.findById(req.params.id);
  if(!product)
  return res.status(404).json({message:`invalid product id ${req.params.id}`})
  
  if(req.body.name){
      if(await productModel.findOne({name:req.body.name}).select('name')){
          return res.status(409).json({message:`product ${req.body.name} already exist`})
      }
      product.name=req.body.name;
      product.slug=slugify(req.body.name);
  }
  if(req.body.status){
      product.status=req.body.status;
  }
  if(req.file){
      const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/product`})
    await cloudinary.uploader.destroy(product.image.public_id)
      product.image={secure_url,public_id};
  }
  
  await product.save()
       // تحقق مما إذا كان المنتج موجودًا في قائمة المفضلة لأي مستخدم
    const usersWithFavoriteProduct = await userModel.find({ favoriteProducts: req.params.productId });
  for (const user of usersWithFavoriteProduct) {
            const title = "تم تحديث المنتج المفضل لديك";
            const content = `تم تحديث المنتج ${product.name}`;
            const userId = user._id;
            await createNotification({ title, content, userId });
        }

  return res.status(200).json({message:"success"});
  
  }catch(err){
  return res.status(500).json({message:"error",err:err.stack});
      
  }
  };