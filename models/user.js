import mongoose from "mongoose";
import { createHmac, randomBytes } from "crypto";
import { createTokenForUser } from "../services/auth.js";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salt: { type: String, required: true },
    password: { type: String, required: true },
    profileImageURL: {
  type: String,
  default: "/images/default.jpg"
},

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

UserSchema.pre("validate", function () {
  if (!this.isModified("password")) return;

  this.salt = randomBytes(16).toString("hex");
  this.password = createHmac("sha256", this.salt)
    .update(this.password)
    .digest("hex");
});

UserSchema.methods.matchPasswordAndGenerateToken = function (password) {
  const hash = createHmac("sha256", this.salt)
    .update(password)
    .digest("hex");

  if (hash !== this.password) {
    throw new Error("Invalid password");
  }

  const token = createTokenForUser(this);
  return token;
};

UserSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.salt;
  return obj;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
