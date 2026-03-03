import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    bookId: String,
    user: String,
    text: String,
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
