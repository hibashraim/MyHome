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
discount:{
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
updateBy: { type: Schema.Types.ObjectId, ref: 'User' },
createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
},
{
    timestamps:true,
}
);

const productModel=mongoose.models.Product || model('Product',productSchema);
export default productModel;