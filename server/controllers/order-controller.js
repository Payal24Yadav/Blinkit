// server/controllers/order-controller.js

import Stripe from "stripe"; // ✔ Import directly from stripe package
import UserModel from "../model/user-model.js";
import CartProductModel from "../model/cartproduct-model.js";
import OrderModel from "../model/order-model.js";
import mongoose from "mongoose";

// Initialize Stripe once
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// -------------------- CASH ON DELIVERY --------------------
export async function CashOnDeliveryOrderController(req, res) {
  try {
    const userId = req.userId;
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

    const payload = list_items.map((el) => ({
      userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      productId: el.productId?._id,
      product_details: {
        name: el.productId.name,
        image: el.productId.image,
      },
      paymentId: "",
      payment_status: "CASH ON DELIVERY",
      delivery_address: addressId,
      subTotalAmt,
      totalAmt,
    }));

    const generatedOrder = await OrderModel.insertMany(payload);

    // Remove items from cart
    await CartProductModel.deleteMany({ userId });
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    return res.json({
      message: "Order placed successfully",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// -------------------- DISCOUNT FUNCTION --------------------
export const pricewithDiscount = (price, dis = 1) => {
  const discountAmount = Math.ceil((Number(price) * Number(dis)) / 100);
  return Number(price) - discountAmount;
};

// // -------------------- STRIPE PAYMENT --------------------
// export async function paymentController(req, res) {
//   try {
//     const userId = req.userId;
//     const { list_items, totalAmt, addressId } = req.body;

//     if (!list_items || list_items.length === 0) throw new Error("Cart is empty");
//     if (!addressId) throw new Error("Address is required");

//     const user = await UserModel.findById(userId);
//     if (!user) throw new Error("User not found");

//     const line_items = list_items.map((item, index) => {
//       const imagesData = item.productId?.image;
//       let images = [];

//       if (Array.isArray(imagesData)) images = imagesData;
//       else if (imagesData && typeof imagesData === "object") images = Object.values(imagesData);
//       else images = [imagesData];

//       images = images.filter((img) => typeof img === "string" && img.startsWith("http"));
//       if (!images.length) images = ["https://via.placeholder.com/150"];

//       const finalPrice = Math.round(pricewithDiscount(item.productId?.price || 0, item.productId?.discount || 0) * 100);

//       return {
//         price_data: {
//           currency: "inr",
//           product_data: {
//             name: item.productId?.name || "Product",
//             images,
//             metadata: { productId: item.productId?._id?.toString() },
//           },
//           unit_amount: finalPrice,
//         },
//         quantity: item.quantity || 1,
//       };
//     });

//     const session = await stripe.checkout.sessions.create({
//       submit_type: "pay",
//       mode: "payment",
//       payment_method_types: ["card"],
//       customer_email: user.email,
//       metadata: { userId: userId.toString(), addressId: addressId.toString() },
//       line_items,
//       success_url: `${process.env.CLIENT_URL}/success`,
//       cancel_url: `${process.env.CLIENT_URL}/cancel`,
//     });

//     return res.status(200).json({ id: session.id, url: session.url });
//   } catch (error) {
//     return res.status(500).json({ message: error.message || error, error: true, success: false });
//   }
// }

// // -------------------- PROCESS STRIPE WEBHOOK --------------------
// const getOrderProductItems = async ({ lineItems, userId, addressId, paymentId, payment_status }) => {
//   console.log("--- 3. Processing Line Items ---");
//   const productList = [];

//   if (lineItems?.data?.length) {
//     for (const item of lineItems.data) {
//       console.log(`Retrieving Stripe Product for: ${item.description}`);
//       const product = await stripe.products.retrieve(item.price.product);

//       console.log("Product Metadata found:", product.metadata);

//       productList.push({
//         userId,
//         orderId: `ORD-${new mongoose.Types.ObjectId()}`,
//         productId: product.metadata.productId, // CRITICAL: Ensure this was set in paymentController
//         product_details: { name: product.name, image: product.images },
//         paymentId,
//         payment_status,
//         delivery_address: addressId,
//         subTotalAmt: Number(item.amount_total / 100),
//         totalAmt: Number(item.amount_total / 100),
//       });
//     }
//   }

//   console.log(`--- 4. Final Product List Created (${productList.length} items) ---`);
//   return productList;
// };

// export async function webhookStripe(req, res) {
//  const sig = req.headers["stripe-signature"];
//   const endpointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

//   console.log("--- Webhook Hit Successfully! ---"); // Agar ye print hua toh route sahi hai

//   let event;
//   try {
//     // Yahan req.body use karein agar express.raw upar lagaya hai
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//     console.log("✅ Event Verified:", event.type);
//   } catch (err) {
//     console.error("❌ Verification Failed:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   switch (event.type) {
//     case "checkout.session.completed":
//       const session = event.data.object;
//       console.log("--- 2. Session Completed ---");
//       console.log("User ID from Metadata:", session.metadata?.userId);
//       console.log("Address ID from Metadata:", session.metadata?.addressId);

//       const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

//       const orderProduct = await getOrderProductItems({
//         lineItems,
//         userId: session.metadata.userId,
//         addressId: session.metadata.addressId,
//         paymentId: session.payment_intent,
//         payment_status: session.payment_status,
//       });

//       if (orderProduct.length > 0) {
//         try {
//           const insertedOrders = await OrderModel.insertMany(orderProduct);
//           console.log("✅ SUCCESS: Orders saved to MongoDB:", insertedOrders.length);

//           await UserModel.findByIdAndUpdate(session.metadata.userId, { shopping_cart: [] });
//           await CartProductModel.deleteMany({ userId: session.metadata.userId });
//           console.log("🧹 Cart cleared for user.");
//         } catch (dbError) {
//           console.error("❌ MongoDB Save Error:", dbError.message);
//         }
//       } else {
//         console.warn("⚠️ No products found to save in order.");
//       }
//       break;

//     default:
//       console.log(`Skipping event type: ${event.type}`);
//   }

//   res.json({ received: true });
// }

//before
// const getOrderProductItems = async({
//     lineItems,
//     userId,
//     addressId,
//     paymentId,
//     payment_status,
//  })=>{
//     const productList = []

//     if(lineItems?.data?.length){
//         for(const item of lineItems.data){
//             const product = await Stripe.products.retrieve(item.price.product)

//             const paylod = {
//                 userId : userId,
//                 orderId : `ORD-${new mongoose.Types.ObjectId()}`,
//                 productId : product.metadata.productId,
//                 product_details : {
//                     name : product.name,
//                     image : product.images
//                 } ,
//                 paymentId : paymentId,
//                 payment_status : payment_status,
//                 delivery_address : addressId,
//                 subTotalAmt  : Number(item.amount_total / 100),
//                 totalAmt  :  Number(item.amount_total / 100),
//             }

//             productList.push(paylod)
//         }
//     }

//     return productList
// }

// //http://localhost:5000/api/order/webhook
// export async function webhookStripe(request,response){
//     const event = request.body;
//     const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY

//     console.log("event",event)

//     // Handle the event
//   switch (event.type) {
//     case 'checkout.session.completed':
//       const session = event.data.object;
//       const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
//       const userId = session.metadata.userId
//       const orderProduct = await getOrderProductItems(
//         {
//             lineItems : lineItems,
//             userId : userId,
//             addressId : session.metadata.addressId,
//             paymentId  : session.payment_intent,
//             payment_status : session.payment_status,
//         })

//       const order = await OrderModel.insertMany(orderProduct)

//         console.log(order)
//         if(Boolean(order[0])){
//             const removeCartItems = await  UserModel.findByIdAndUpdate(userId,{
//                 shopping_cart : []
//             })
//             const removeCartProductDB = await CartProductModel.deleteMany({ userId : userId})
//         }
//       break;
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a response to acknowledge receipt of the event
//   response.json({received: true});
// }

// export async function getOrderDetailsController(request,response){
//     try {
//         const userId = request.userId // order id

//         const orderlist = await OrderModel.find({ userId : userId }).sort({ createdAt : -1 }).populate('delivery_address')

//         return response.json({
//             message : "order list",
//             data : orderlist,
//             error : false,
//             success : true
//         })
//     } catch (error) {
//         return response.status(500).json({
//             message : error.message || error,
//             error : true,
//             success : false
//         })
//     }
// }

// final
// -------------------- HELPER: GET PRODUCT ITEMS --------------------
const getOrderProductItems = async ({
  lineItems,
  userId,
  addressId,
  paymentId,
  payment_status,
}) => {
  console.log("--- STEP 3: Processing Line Items from Stripe ---");
  const productList = [];

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      console.log(
        `--- STEP 3.1: Retrieving Product for: ${item.description} ---`,
      );

      // Stripe se actual product object fetch karna (Metadata ke liye)
      const product = await stripe.products.retrieve(item.price.product);

      console.log("--- STEP 3.2: Product Metadata Check ---", product.metadata);

      productList.push({
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images,
        },
        paymentId: paymentId,
        payment_status: payment_status,
        delivery_address: addressId,
        subTotalAmt: Number(item.amount_total / 100),
        totalAmt: Number(item.amount_total / 100),
      });
    }
  }
  console.log(
    `--- STEP 4: Product List Ready with ${productList.length} items ---`,
  );
  return productList;
};

// -------------------- STRIPE PAYMENT CONTROLLER --------------------
export async function paymentController(req, res) {
  try {
    console.log("--- PAYMENT START: Creating Stripe Session ---");
    const userId = req.userId;
    const { list_items, addressId } = req.body;

    const user = await UserModel.findById(userId);

    const line_items = list_items.map((item) => {
      const finalPrice = Math.round(
        (item.productId?.price -
          (item.productId?.price * (item.productId?.discount || 0)) / 100) *
          100,
      );

      // paymentController ke andar line_items ke pass:
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.productId?.name,
            images: item.productId?.image,
            // Metadata yahan product level par hai
            metadata: {
              productId: item.productId?._id.toString(),
            },
          },
          unit_amount: finalPrice,
        },
        // Hum yahan bhi metadata pass kar sakte hain (Optional but safer)
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        userId: userId.toString(),
        addressId: addressId.toString(),
      },
      line_items,
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    console.log("--- PAYMENT SESSION CREATED --- ID:", session.id);
    return res.status(200).json(session);
  } catch (error) {
    console.error("❌ PAYMENT CONTROLLER ERROR:", error.message);
    return res.status(500).json({ message: error.message });
  }
}

// -------------------- WEBHOOK CONTROLLER --------------------
export async function webhookStripe(req, res) {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log("❌ Webhook Sig Error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        
        console.log("--- STEP 2.1: REAL SESSION DETECTED ---");
        console.log("User:", session.metadata?.userId);

        // AGAR USERID NAHI HAI, MATLAB YE DUMMY TRIGGER HAI, ISSE ROK DO
        if (!session.metadata?.userId) {
            console.log("⚠️ Stopping: This is a dummy trigger without metadata.");
            return res.json({ received: true });
        }

        try {
            // Retrieve line items with expand to get product metadata directly!
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
                expand: ['data.price.product'], 
            });

            const productList = lineItems.data.map(item => {
                // Stripe ne expand kar diya hai toh humein retrieve karne ki zaroorat nahi padegi
                const product = item.price.product; 
                
                return {
                    userId: session.metadata.userId,
                    orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                    productId: product.metadata.productId,
                    product_details: {
                        name: product.name,
                        image: product.images
                    },
                    paymentId: session.payment_intent,
                    payment_status: session.payment_status.toUpperCase(),
                    delivery_address: session.metadata.addressId,
                    subTotalAmt: Number(item.amount_total / 100),
                    totalAmt: Number(item.amount_total / 100),
                };
            });

            if (productList.length > 0) {
                await OrderModel.insertMany(productList);
                await UserModel.findByIdAndUpdate(session.metadata.userId, { shopping_cart: [] });
                await CartProductModel.deleteMany({ userId: session.metadata.userId });
                console.log("✅ SUCCESS: Order saved to MongoDB and Cart Cleared");
            }
        } catch (error) {
            console.error("❌ ERROR DURING LINE ITEM PROCESSING:", error.message);
        }
    }

    res.json({ received: true });
}