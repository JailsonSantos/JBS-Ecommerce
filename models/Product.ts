import mongoose, { Schema } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  picture: string;
}

// 2. Create a Schema corresponding to the document interface.
const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  picture: { type: String, required: true }
});

//type Product = InferSchemaType<typeof productSchema>;

// 3. Create a Model.
const Product = mongoose.models.Product || mongoose.model("Product", productSchema)

export default Product