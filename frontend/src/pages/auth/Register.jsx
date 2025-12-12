import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validation/auth.schema";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

const Register = () => {
  const { register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  const onSubmit = async (data) => {
    try {
      if (data.dateOfBirth) {
        const [day, month, year] = data.dateOfBirth.split("/");
        data.dateOfBirth = `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0"
        )}`;
      }

      const response = await registerUser(data);

      if (response?.accountStatus === "pending") {
        navigate("/pending-approval");
        return;
      }

      if (response?.success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {" "}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register as Chauffeur
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your chauffeur account for Fleet Management System
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {" "}
          <div className="bg-white shadow rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number *
                </label>
                <input
                  id="phoneNumber"
                  type="text"
                  placeholder="e.g., 0612345678"
                  {...register("phoneNumber")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="nationalId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  National ID *
                </label>
                <input
                  id="nationalId"
                  type="text"
                  {...register("nationalId")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.nationalId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nationalId.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date of Birth *
                </label>
                <input
                  id="dateOfBirth"
                  type="text"
                  placeholder="DD/MM/YYYY (e.g., 02/02/2000)"
                  {...register("dateOfBirth")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>
            </div>

            <hr className="my-6" />
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Driver License Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="licenseNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  License Number *
                </label>
                <input
                  id="licenseNumber"
                  type="text"
                  {...register("licenseNumber")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.licenseNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.licenseNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="licenseType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  License Type *
                </label>
                <select
                  id="licenseType"
                  {...register("licenseType")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select license type</option>
                  <option value="B">B </option>
                  <option value="C">C </option>
                  <option value="D">D</option>
                  <option value="EC">EC</option>
                </select>
                {errors.licenseType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.licenseType.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address *
                </label>
                <textarea
                  id="address"
                  {...register("address")}
                  rows={3}
                  placeholder="Full address including street, city, and postal code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </div>
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
