import mongoose from "mongoose";
const { Schema } = mongoose;

// Create schema
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// "users" is a collection (like a table in SQL)
const User = mongoose.model("users", UserSchema);

// Exporting the model
export default User;
