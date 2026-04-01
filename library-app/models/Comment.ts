import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  bookId: string;
  user: string;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const commentSchema = new Schema<IComment>(
  {
    bookId: String,
    user: String,
    text: String,
  },
  { timestamps: true }
);

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
