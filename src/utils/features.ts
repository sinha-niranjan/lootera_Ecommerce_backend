import mongoose from "mongoose";
import { OrderItemType, invalidateCacheType } from "../types/type.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";

export const connectDB = (uri: string) => {
  mongoose
    .connect(uri, { dbName: "Ecommerce_typescript" })
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

export const invalidateCache = async ({
  product,
  order,
  admin,
  userId,
}: invalidateCacheType) => {
  if (product) {
    const productKeys: string[] = [
      "latesProducts",
      "categories",
      "allProducts",
    ];

    const products = await Product.find({}).select("_id");

    products.forEach((i) => {
      productKeys.push(`product${i._id}`);
    });
    myCache.del(productKeys);
  }
  if (order) {
    const ordersKeys: string[] = ["allOrders", `myOrders${userId}`];
    const orders = await Order.find({}).select("_id");

    orders.forEach((i) => {
      ordersKeys.push(`order${i._id}`);
    });

    myCache.del(ordersKeys);
  }

  if (admin) {
  }
};

export const reduceStock = async (orderItems: OrderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product  not Found !");
    product.stock -= order.quantity;
    await product.save();
  }
};
