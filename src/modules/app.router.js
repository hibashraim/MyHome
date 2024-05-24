import connectDB from '../../DB/connection.js';
import categoriesRouter from './categories/categories.router.js'
import authRouter from './auth/auth.router.js'
import subcategoryRouter from './subcategory/subcategory.router.js'
import productsRouter from './products/product.router.js';
import couponRoutr from './coupon/coupon.router.js'
import cartRouter from './cart/cart.router.js'
import orderRouter from "./order/order.router.js";

import { globalErrorHandler } from "../services/errorHandling.js";
import { sendEmail } from '../services/email.js';
import favoriteListRouter from  "./FavoriteList/favoriteList.router.js"

const initApp=(app,express)=>{
    app.use(express.json());
    connectDB();
    app.get('/',(req,res)=>{
        return res.status(200).json({message:"welcome"});
})


app.use('/auth',authRouter);
app.use('/categories',categoriesRouter);

app.use('/subcategory',subcategoryRouter);
app.use('/product',productsRouter);

app.use('/coupon',couponRoutr);

app.use('/cart',cartRouter);
app.use("/order", orderRouter);
app.use("/favorite", favoriteListRouter);


app.get("*",(req,res)=>{
    return res.status(500).json({message:"page not found"});
})
app.use(globalErrorHandler);
};
    export default initApp;