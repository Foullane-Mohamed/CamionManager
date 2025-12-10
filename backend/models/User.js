import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "chauffeur"],
        message: "{VALUE} is not a valid role",
      },
      default: "chauffeur",
    },
    accountStatus: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected"],
        message: "{VALUE} is not a valid account status",
      },
      default: function () {
        return this.role === "chauffeur" ? "pending" : "approved";
      },
    },
    phoneNumber: {
      type: String,
      required: function () {
        return this.role === "chauffeur";
      },
      validate: {
        validator: function (v) {
          if (this.role !== "chauffeur") return true;
          return /^[0-9]{10,15}$/.test(v);
        },
        message: "Phone number must be between 10 and 15 digits",
      },
    },
    nationalId: {
      type: String,
      required: function () {
        return this.role === "chauffeur";
      },
      unique: true,
      sparse: true,
      trim: true,
      minlength: [5, "National ID must be at least 5 characters"],
      maxlength: [50, "National ID cannot exceed 50 characters"],
    },
    licenseNumber: {
      type: String,
      required: function () {
        return this.role === "chauffeur";
      },
      unique: true,
      sparse: true,
      trim: true,
      minlength: [5, "License number must be at least 5 characters"],
      maxlength: [50, "License number cannot exceed 50 characters"],
    },
    licenseType: {
      type: String,
      enum: {
        values: ["B", "C", "D", "EC"],
        message: "{VALUE} is not a valid license type",
      },
      required: function () {
        return this.role === "chauffeur";
      },
    },
    address: {
      type: String,
      required: function () {
        return this.role === "chauffeur";
      },
      trim: true,
      minlength: [10, "Address must be at least 10 characters"],
      maxlength: [500, "Address cannot exceed 500 characters"],
    },
    dateOfBirth: {
      type: Date,
      required: function () {
        return this.role === "chauffeur";
      },
      validate: {
        validator: function (v) {
          if (this.role !== "chauffeur") return true;
          const age = (new Date() - new Date(v)) / (1000 * 60 * 60 * 24 * 365);
          return age >= 18 && age <= 100;
        },
        message: "Driver must be between 18 and 100 years old",
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
