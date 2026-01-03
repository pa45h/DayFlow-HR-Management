import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["employee", "hr", "admin"],
      default: "employee",
    },
    image: {
      type: String, // store image URL / Cloudinary URL
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
