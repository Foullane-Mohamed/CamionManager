import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tireSchema } from "../../validation/tire.schema";
import { tireService } from "../../services/tire.service";
import { truckService } from "../../services/truck.service";
import { trailerService } from "../../services/trailer.service";
import { toast } from "react-toastify";

const TireEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(tireSchema),
  });

  const vehicleType = watch("associatedVehicleType");

  useEffect(() => {
    loadVehicles();
  }, [vehicleType]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const data = await tireService.getOne(id);
      setValue("serialNumber", data.serialNumber);
      setValue("brand", data.brand);
      setValue("size", data.size);
      setValue("status", data.status);
      setValue("installationDate", new Date(data.installationDate).toISOString().slice(0, 10));
      setValue("vehiclePosition", data.vehiclePosition);
      setValue("associatedVehicleType", data.associatedVehicleType);
      setValue("associatedVehicleId", data.associatedVehicleId?._id || data.associatedVehicleId);
    } catch (error) {
      toast.error("Failed to load tire data");
      navigate("/tires");
    } finally {
      setLoading(false);
    }
  };

  const loadVehicles = async () => {
    try {
      if (vehicleType === "Truck") {
        const trucks = await truckService.getAll();
        setVehicles(trucks.map(t => ({ id: t._id, label: t.matricule })));
      } else if (vehicleType === "Trailer") {
        const trailers = await trailerService.getAll();
        setVehicles(trailers.map(t => ({ id: t._id, label: t.matricule })));
      }
    } catch (error) {
      toast.error("Failed to load vehicles");
    }
  };

  const onSubmit = async (data) => {
    try {
      await tireService.update(id, data);
      toast.success("Tire updated successfully");
      navigate(`/tires/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update tire");
    }
  };

  const positions = [
    "Front Left", "Front Right", "Rear Left", "Rear Right", "Spare",
    "Trailer Front Left", "Trailer Front Right", "Trailer Rear Left", "Trailer Rear Right",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading tire data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Tire</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number *</label>
          <input type="text" {...register("serialNumber")} className="w-full px-3 py-2 border rounded" />
          {errors.serialNumber && <p className="text-red-600 text-sm">{errors.serialNumber.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
          <input type="text" {...register("brand")} className="w-full px-3 py-2 border rounded" />
          {errors.brand && <p className="text-red-600 text-sm">{errors.brand.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Size *</label>
          <input type="text" {...register("size")} className="w-full px-3 py-2 border rounded" />
          {errors.size && <p className="text-red-600 text-sm">{errors.size.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select {...register("status")} className="w-full px-3 py-2 border rounded">
            <option value="Bon">Bon</option>
            <option value="Usé">Usé</option>
            <option value="À remplacer">À remplacer</option>
          </select>
          {errors.status && <p className="text-red-600 text-sm">{errors.status.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Installation Date *</label>
          <input type="date" {...register("installationDate")} className="w-full px-3 py-2 border rounded" />
          {errors.installationDate && <p className="text-red-600 text-sm">{errors.installationDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
          <select {...register("vehiclePosition")} className="w-full px-3 py-2 border rounded">
            <option value="">Select position</option>
            {positions.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
          {errors.vehiclePosition && <p className="text-red-600 text-sm">{errors.vehiclePosition.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
          <select {...register("associatedVehicleType")} className="w-full px-3 py-2 border rounded">
            <option value="Truck">Truck</option>
            <option value="Trailer">Trailer</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle *</label>
          <select {...register("associatedVehicleId")} className="w-full px-3 py-2 border rounded">
            <option value="">Select vehicle</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
          {errors.associatedVehicleId && <p className="text-red-600 text-sm">{errors.associatedVehicleId.message}</p>}
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {isSubmitting ? "Updating..." : "Update Tire"}
          </button>
          <button type="button" onClick={() => navigate(`/tires/${id}`)} className="px-4 py-2 border rounded hover:bg-gray-100">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TireEdit;
