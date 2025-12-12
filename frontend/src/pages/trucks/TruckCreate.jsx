import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { truckSchema } from "../../validation/truck.schema";
import { truckService } from "../../services/truck.service";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const TruckCreate = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useApp();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(truckSchema),
    defaultValues: {
      status: "Disponible",
      currentMileage: 0,
    },
  });
  const onSubmit = async (data) => {
    try {
      data.yearOfManufacture = parseInt(data.yearOfManufacture);
      data.currentMileage = parseInt(data.currentMileage);

      await truckService.create(data);
      showSuccess("Truck created successfully");
      navigate("/trucks");
    } catch (error) {
      showError(error.response?.data?.message || "Failed to create truck");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Truck</h1>
        <p className="text-gray-600 mt-2">
          Fill in the details to add a new truck
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="matricule"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Matricule *
            </label>
            <input
              id="matricule"
              type="text"
              {...register("matricule")}
              placeholder="TRK-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.matricule && (
              <p className="mt-1 text-sm text-red-600">
                {errors.matricule.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Uppercase alphanumeric with hyphens only
            </p>
          </div>

          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Brand *
            </label>
            <input
              id="brand"
              type="text"
              {...register("brand")}
              placeholder="Volvo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.brand && (
              <p className="mt-1 text-sm text-red-600">
                {errors.brand.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="model"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Model *
            </label>
            <input
              id="model"
              type="text"
              {...register("model")}
              placeholder="FH16"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600">
                {errors.model.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="yearOfManufacture"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Year of Manufacture *
            </label>
            <input
              id="yearOfManufacture"
              type="number"
              {...register("yearOfManufacture", { valueAsNumber: true })}
              placeholder="2020"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.yearOfManufacture && (
              <p className="mt-1 text-sm text-red-600">
                {errors.yearOfManufacture.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="fuelType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fuel Type *
            </label>
            <select
              id="fuelType"
              {...register("fuelType")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select fuel type</option>
              <option value="Diesel">Diesel</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Other">Other</option>
            </select>
            {errors.fuelType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fuelType.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status *
            </label>
            <select
              id="status"
              {...register("status")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Disponible">Disponible</option>
              <option value="En Mission">En Mission</option>
              <option value="En Maintenance">En Maintenance</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">
                {errors.status.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="currentMileage"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Current Mileage (km) *
            </label>
            <input
              id="currentMileage"
              type="number"
              {...register("currentMileage", { valueAsNumber: true })}
              placeholder="150000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.currentMileage && (
              <p className="mt-1 text-sm text-red-600">
                {errors.currentMileage.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/trucks")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Truck"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TruckCreate;
