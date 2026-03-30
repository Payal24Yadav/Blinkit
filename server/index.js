import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectDB.js';
import userRouter from './route/user-route.js';
import categoryRouter from './route/category-route.js';
import uploadRouter from './route/upload-route.js';
import subCategoryRouter from './route/subCategory-route.js';
import productRouter from './route/product-route.js';
import cartRouter from './route/cart-route.js';
import addressRouter from './route/address-route.js';
import orderRouter from './route/order-route.js';

import { webhookStripe } from "./controllers/order-controller.js";
import bodyParser from "body-parser";


const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));

app.post(
  "/api/order/webhook",
  bodyParser.raw({ type: "application/json" }), // important for Stripe
  webhookStripe // call controller directly
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev')); //  correct
app.use(helmet({
    contentSecurityPolicy: false
}));

const PORT = process.env.PORT || 8080;


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/user', userRouter)
app.use("/api/category", categoryRouter)
app.use("/api/file", uploadRouter)
app.use("/api/subcategory", subCategoryRouter)
app.use("/api/product", productRouter)
app.use('/api/cart', cartRouter)
app.use("/api/address", addressRouter)
app.use("/api/order", orderRouter)



connectDB().then(()=>{
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
});
