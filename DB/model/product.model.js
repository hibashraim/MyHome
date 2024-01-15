import mongoose,{Schema,Types,model} from 'mongoose'

const productSchema=new Schema({
  name:{
    type:String,
    required:true,
    unique:true,
    trim:true,
  },
  slug:{
  type:String,
  required:true,
  },
  description:{
    type:String,
    required:false,
  },
  stock:{
    type:Number,
    default:1,
},
price:{
    type:Number,
    required:true,
},
dicount:{
type:Number,
default:0,
},
finalPrice:{
    type:Number,
},
number_sellers:{
    type:Number,
    default:0,
},
mainImage:{
    type:Object,
    required:true,
},
subImage:[{
    type:Object,
    required:true,
}],
status:{
    type:String,
    default:'Active',
    enum:['Active','Inactive'],
},
isDeleted:{
    type:Boolean,
    default:false,
},
colors:[String],
sizes:[{
    type:String,
    enum:['s','m','lg','xl'],
}],
categoryId:{ type:Types.ObjectId, ref:'Category', required:true},
subcategoryId:{ type:Types.ObjectId, ref:'subCategory', required:true},
createdBy:{ type:Types.ObjectId,  ref:'User', required:true,},
updateBy:{type:Types.ObjectId, ref:'User',required:true},
},
{
    timestamps:true,
}
);

const productModel=mongoose.models.Product || model('Product',productSchema);
export default productModel;