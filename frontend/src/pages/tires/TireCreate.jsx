import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tireSchema } from "../../validation/tire.schema";
import { tireService } from "../../services/tire.service";
import { truckService } from "../../services/truck.service";
import { trailerService } from "../../services/trailer.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Circle, Save, X, Loader2, Calendar, Truck, Hash, Package, CheckCircle, MapPin, Tag } from "lucide-react";

const TireCreate = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(tireSchema),
    defaultValues: {
      status: "Bon",
      associatedVehicleType: "Truck",
    },
  });

  const vehicleType = watch("associatedVehicleType");

  useEffect(() => {
    loadVehicles();
  }, [vehicleType]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      if (vehicleType === "Truck") {
        const trucks = await truckService.getAll();
        setVehicles(trucks.map(t => ({ id: t._id, label: t.matricule })));
      } else {
        const trailers = await trailerService.getAll();
        setVehicles(trailers.map(t => ({ id: t._id, label: t.matricule })));
      }
    } catch (error) {
      toast.error("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await tireService.create(data);
      toast.success("Tire created successfully");
      navigate("/tires");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create tire");
    }
  };

  const positions = [
    "Front Left",
    "Front Right",
    "Rear Left",
    "Rear Right",
    "Spare",
    "Trailer Front Left",
    "Trailer Front Right",
    "Trailer Rear Left",
    "Trailer Rear Right",
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
          <Circle className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Tire</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Fill in the details to add a new tire</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Hash className="w-4 h-4" />
              Serial Number *
            </label>
            <input
              type="text"
              {...register("serialNumber")}
              placeholder="TIRE-001"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.serialNumber && <p className="mt-2 text-sm text-red-600">{errors.serialNumber.message}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Tag className="w-4 h-4" />
              Brand *
            </label>
            <input
              type="text"
              {...register("brand")}
              placeholder="Michelin"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.brand && <p className="mt-2 text-sm text-red-600">{errors.brand.message}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Package className="w-4 h-4" />
              Size *
            </label>
            <input
              type="text"
              {...register("size")}
              placeholder="295/80R22.5"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.size && <p className="mt-2 text-sm text-red-600">{errors.size.message}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <CheckCircle className="w-4 h-4" />
              Status *
            </label>
            <select
              {...register("status")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Bon">Bon</option>
              <option value="Usé">Usé</option>
              <option value="À remplacer">À remplacer</option>
            </select>
            {errors.status && <p className="mt-2 text-sm text-red-600">{errors.status.message}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4" />
              Installation Date *
            </label>
            <input
              type="date"
              {...register("installationDate")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.installationDate && <p className="mt-2 text-sm text-red-600">{errors.installationDate.message}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4" />
              Position *
            </label>
            <select
              {...register("vehiclePosition")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select position</option>
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
            {errors.vehiclePosition && <p className="mt-2 text-sm text-red-600">{errors.vehiclePosition.message}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Truck className="w-4 h-4" />
              Vehicle Type *
            </label>
            <select
              {...register("associatedVehicleType")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Truck">Truck</option>
              <option value="Trailer">Trailer</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Truck className="w-4 h-4" />
              Vehicle *
            </label>
            <select
              {...register("associatedVehicleId")}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Select vehicle</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
            </select>
            {errors.associatedVehicleId && <p className="mt-2 text-sm text-red-600">{errors.associatedVehicleId.message}</p>}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/tires")}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSubmitting ? "Creating..." : "Create Tire"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TireCreate;
