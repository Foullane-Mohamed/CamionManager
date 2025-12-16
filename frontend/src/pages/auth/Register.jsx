import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validation/auth.schema";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import {
  Truck,
  UserPlus,
  Mail,
  Lock,
  Phone,
  CreditCard,
  Calendar,
  MapPin,
  Loader2,
  User,
  IdCard,
} from "lucide-react";

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
      }      if (response?.success) {
        navigate("/dashboard");
      }
    } catch {
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Truck className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Register as Chauffeur
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create your chauffeur account for Fleet Management System
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <User className="w-4 h-4" />
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </label>
                  <input
                    id="phoneNumber"
                    type="text"
                    placeholder="0612345678"
                    {...register("phoneNumber")}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <Lock className="w-4 h-4" />
                    Password *
                  </label>
                  <input
                    id="password"
                    type="password"
                    {...register("password")}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="nationalId"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <IdCard className="w-4 h-4" />
                    National ID *
                  </label>
                  <input
                    id="nationalId"
                    type="text"
                    {...register("nationalId")}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                    placeholder="AB123456"
                  />
                  {errors.nationalId && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.nationalId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="licenseNumber"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    License Number *
                  </label>
                  <input
                    id="licenseNumber"
                    type="text"
                    {...register("licenseNumber")}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                    placeholder="DL123456"
                  />
                  {errors.licenseNumber && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.licenseNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="licenseType"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    License Type *
                  </label>
                  <select
                    id="licenseType"
                    {...register("licenseType")}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  >
                    <option value="">Select license type</option>
                    <option value="B">B - Light vehicles</option>
                    <option value="C">C - Medium trucks</option>
                    <option value="D">D - Buses</option>
                    <option value="EC">EC - Heavy trucks with trailer</option>
                  </select>
                  {errors.licenseType && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.licenseType.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Date of Birth *
                  </label>
                  <input
                    id="dateOfBirth"
                    type="text"
                    placeholder="DD/MM/YYYY"
                    {...register("dateOfBirth")}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Address *
                  </label>
                  <input
                    id="address"
                    type="text"
                    {...register("address")}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                    placeholder="123 Main St, City"
                  />
                  {errors.address && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
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
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Register
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
              <Link
                to="/login"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                ← Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
