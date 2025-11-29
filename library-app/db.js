import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/library";

mongoose
  .connect(mongoUrl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connect error:", err));

export default mongoose;
