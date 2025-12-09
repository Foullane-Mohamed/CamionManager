import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "chauffeur"],
      default: "chauffeur",
    },
    accountStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function () {
        return this.role === "chauffeur" ? "pending" : "approved";
      },
    },
    phoneNumber: {
      type: String,
      required: function () {
        return this.role === "chauffeur";
      },
    },
    nationalId: {
      type: String,
      required: function () {
        return this.role === "chauffeur";
      },
      unique: true,
      sparse: true,
    },
    licenseNumber: {
      type: String,
      required: function () {
        return this.role === "chauffeur";
      },
      unique: true,
      sparse: true,
    },
    licenseType: {
      type: String,
      enum: ["B", "C", "D", "EC"],
      required: function () {
        return this.role === "chauffeur";
      },
    },
    address: {
      type: String,
      required: function () {
        return this.role === "chauffeur";
      },
    },
    dateOfBirth: {
      type: Date,
      required: function () {
        return this.role === "chauffeur";
      },
    },
    isAvailable: { type: Boolean, default: true },
    refreshToken: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
