import { Schema, model } from "mongoose";
import { IBook } from "./Book.interface";

const BookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: ["Fiction", "Science", "SelfDevelopment", "Poetry", "Religious"],
  },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  inStock: { type: Boolean, required: true, default: true },
  isDeleted: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  publishedAt: { type: Date, default: Date.now },
  imageUrl: {
    type: String,
    default: "https://placehold.co/600x400?text=Book+Cover",
  },
});

const BookModel = model<IBook>("Book", BookSchema);

export default BookModel;
