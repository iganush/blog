import mongoose from "mongoose";
import { createHmac, randomBytes } from "crypto";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salt: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

UserSchema.pre("validate", async function () {
  if (!this.isModified("password")) return;

  this.salt = randomBytes(16).toString("hex");
  this.password = createHmac("sha256", this.salt)
    .update(this.password)
    .digest("hex");
});

UserSchema.methods.matchPassword = function (password) {
  const hash = createHmac("sha256", this.salt)
    .update(password)
    .digest("hex");

  return this.password === hash;
};

UserSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.salt;
  return obj;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
