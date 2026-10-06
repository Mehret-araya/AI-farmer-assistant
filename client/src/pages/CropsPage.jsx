
import { useEffect, useRef, useState } from "react";
import {
  createCrop,
  getCrops,
  updateCrop,
  deleteCrop,
} from "../api/crop";
import CropImageUpload from "../components/CropImageUpload";
import CropWeather from "../components/CropWeather";

const SUPPORTED_CROPS = [
  "tomato",
  "maize",
  "wheat",
  "coffee",
];

function CropsPage() {
  const formRef = useRef(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "tomato",
    variety: "",
    plantingDate: "",
    growthStage: "",
    location: "",
    farmSize: "",
    latitude: "",
    longitude: "",
  });

  const [editingCropId, setEditingCropId] = useState(null);

  const token = localStorage.getItem("token");

  const loadCrops = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        throw new Error("You must be logged in to manage crops.");
      }

      const data = await getCrops(token);
      setCrops(data.crops || []);
    } catch (err) {
      setError(err.message || "Failed to load crops.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrops();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "tomato",
      variety: "",
      plantingDate: "",
      growthStage: "",
      location: "",
      farmSize: "",
      latitude: "",
      longitude: "",
    });

    setEditingCropId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setSaving(true);

    try {
      if (!token) {
        throw new Error("You must be logged in.");
      }

      const cropData = {
        name: formData.name,
        variety: formData.variety,
        plantingDate: formData.plantingDate,
        growthStage: formData.growthStage,
        location: formData.location,
        farmSize: Number(formData.farmSize) || 0,
        latitude:
          formData.latitude !== ""
            ? Number(formData.latitude)
            : null,
        longitude:
          formData.longitude !== ""
            ? Number(formData.longitude)
            : null,
      };

      if (editingCropId) {
        await updateCrop(
          editingCropId,
          cropData,
          token
        );

        setMessage("Crop updated successfully.");
      } else {
        await createCrop(cropData, token);

        setMessage("Crop added successfully.");
      }

      resetForm();
      await loadCrops();
    } catch (err) {
      setError(err.message || "Failed to save crop.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (crop) => {
    setEditingCropId(crop._id);

    setFormData({
      name: crop.name || "tomato",
      variety: crop.variety || "",
      plantingDate: crop.plantingDate
        ? crop.plantingDate.split("T")[0]
        : "",
      growthStage: crop.growthStage || "",
      location: crop.location || "",
      farmSize: crop.farmSize ?? "",
      latitude: crop.latitude ?? "",
      longitude: crop.longitude ?? "",
    });

    setMessage("");
    setError("");
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleDelete = async (cropId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this crop?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      if (!token) {
        throw new Error("You must be logged in.");
      }

      await deleteCrop(cropId, token);

      setMessage("Crop deleted successfully.");

      if (editingCropId === cropId) {
        resetForm();
      }

      await loadCrops();
    } catch (err) {
      setError(err.message || "Failed to delete crop.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F4D2B] via-[#245633] to-[#2A5C3A] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Main Garden Card */}
        <div className="relative overflow-hidden rounded-3xl bg-[#2A5C3A] shadow-2xl">

          {/* Subtle decorative background */}
          <div className="pointer-events-none absolute -right-24 -top-24 select-none text-[240px] leading-none text-white opacity-[0.025]">
            ❧
          </div>

          <div className="pointer-events-none absolute -bottom-28 -left-20 select-none text-[260px] leading-none text-[#E8F3E5] opacity-[0.025]">
            ❦
          </div>

          <div className="relative z-10 p-6 sm:p-8 lg:p-12">

            {/* Header */}
            <div className="mb-10 max-w-3xl">
              <div className="mb-4 inline-flex items-center rounded-full border border-[#E8F3E5]/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#E8F3E5]">
                🌿 Farm Management
              </div>

              <h1 className="font-serif text-4xl font-medium tracking-tight text-white sm:text-5xl md:text-6xl">
                My Crops
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-[#DCFCE7]/85 sm:text-lg">
                Manage your crops and analyze their images for
                possible diseases.
              </p>
            </div>

            {/* Form + Intro Layout */}
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">

              {/* Left Intro Card */}
              <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#1F4D2B]/45 p-7 sm:p-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A3E635]">
                    Grow with confidence
                  </p>

                  <h2 className="mt-4 font-serif text-3xl leading-tight text-white sm:text-4xl">
                    Grow a beautiful,
                    <br />
                    healthy farm.
                  </h2>

                  <p className="mt-5 leading-7 text-[#DCFCE7]/80">
                    Keep your crops organized, track their growth,
                    and use AI-powered analysis to monitor their
                    health throughout the season.
                  </p>
                </div>

                <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold text-[#E8F3E5]">
                    🌱 Crop management
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#DCFCE7]/70">
                    Add accurate crop information so your farming
                    tools can provide better recommendations.
                  </p>
                </div>
              </div>

              {/* Add / Edit Crop Form */}
              <div
                ref={formRef}
                className="rounded-3xl border border-white/10 bg-[#1F4D2B]/55 p-6 shadow-xl sm:p-8"
              >
                <div className="mb-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A3E635]">
                    {editingCropId ? "Update information" : "New crop"}
                  </p>

                  <h2 className="mt-2 font-serif text-3xl text-white">
                    {editingCropId ? "Edit Crop" : "Add Crop"}
                  </h2>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="grid gap-5 sm:grid-cols-2"
                >
                  {/* Crop Type */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#DCFCE7]"
                    >
                      Crop Type
                    </label>

                    <select
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 text-[#F5F9F2] outline-none transition focus:border-[#A3E635]/60 focus:ring-2 focus:ring-[#A3E635]/40"
                    >
                      {SUPPORTED_CROPS.map((crop) => (
                        <option
                          key={crop}
                          value={crop}
                          className="bg-[#1F4D2B] text-[#F5F9F2]"
                        >
                          {crop.charAt(0).toUpperCase() +
                            crop.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Variety */}
                  <div>
                    <label
                      htmlFor="variety"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#DCFCE7]"
                    >
                      Variety
                    </label>

                    <input
                      id="variety"
                      name="variety"
                      type="text"
                      value={formData.variety}
                      onChange={handleChange}
                      placeholder="e.g. Roma"
                      className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 text-[#F5F9F2] placeholder:text-[#DCFCE7]/45 outline-none transition focus:border-[#A3E635]/60 focus:ring-2 focus:ring-[#A3E635]/40"
                    />
                  </div>

                  {/* Planting Date */}
                  <div>
                    <label
                      htmlFor="plantingDate"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#DCFCE7]"
                    >
                      Planting Date
                    </label>

                    <input
                      id="plantingDate"
                      name="plantingDate"
                      type="date"
                      value={formData.plantingDate}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 text-[#F5F9F2] outline-none transition focus:border-[#A3E635]/60 focus:ring-2 focus:ring-[#A3E635]/40"
                    />
                  </div>

                  {/* Growth Stage */}
                  <div>
                    <label
                      htmlFor="growthStage"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#DCFCE7]"
                    >
                      Growth Stage
                    </label>

                    <select
                      id="growthStage"
                      name="growthStage"
                      value={formData.growthStage}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 text-[#F5F9F2] outline-none transition focus:border-[#A3E635]/60 focus:ring-2 focus:ring-[#A3E635]/40"
                    >
                      <option
                        value=""
                        className="bg-[#1F4D2B] text-[#F5F9F2]"
                      >
                        Select stage
                      </option>

                      <option
                        value="Seedling"
                        className="bg-[#1F4D2B] text-[#F5F9F2]"
                      >
                        Seedling
                      </option>

                      <option
                        value="Vegetative"
                        className="bg-[#1F4D2B] text-[#F5F9F2]"
                      >
                        Vegetative
                      </option>

                      <option
                        value="Flowering"
                        className="bg-[#1F4D2B] text-[#F5F9F2]"
                      >
                        Flowering
                      </option>

                      <option
                        value="Fruiting"
                        className="bg-[#1F4D2B] text-[#F5F9F2]"
                      >
                        Fruiting
                      </option>

                      <option
                        value="Harvest"
                        className="bg-[#1F4D2B] text-[#F5F9F2]"
                      >
                        Harvest
                      </option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label
                      htmlFor="location"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#DCFCE7]"
                    >
                      Location
                    </label>

                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Addis Ababa"
                      className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 text-[#F5F9F2] placeholder:text-[#DCFCE7]/45 outline-none transition focus:border-[#A3E635]/60 focus:ring-2 focus:ring-[#A3E635]/40"
                    />
                  </div>

                  {/* Farm Size */}
                  <div>
                    <label
                      htmlFor="farmSize"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#DCFCE7]"
                    >
                      Farm Size (hectares)
                    </label>

                    <input
                      id="farmSize"
                      name="farmSize"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.farmSize}
                      onChange={handleChange}
                      placeholder="e.g. 2"
                      className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 text-[#F5F9F2] placeholder:text-[#DCFCE7]/45 outline-none transition focus:border-[#A3E635]/60 focus:ring-2 focus:ring-[#A3E635]/40"
                    />
                  </div>

                  {/* Latitude */}
                  <div>
                    <label
                      htmlFor="latitude"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#DCFCE7]"
                    >
                      Latitude
                    </label>

                    <input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      min="-90"
                      max="90"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="e.g. 13.4967"
                      className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 text-[#F5F9F2] placeholder:text-[#DCFCE7]/45 outline-none transition focus:border-[#A3E635]/60 focus:ring-2 focus:ring-[#A3E635]/40"
                    />
                  </div>

                  {/* Longitude */}
                  <div>
                    <label
                      htmlFor="longitude"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#DCFCE7]"
                    >
                      Longitude
                    </label>

                    <input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      min="-180"
                      max="180"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="e.g. 39.4753"
                      className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 text-[#F5F9F2] placeholder:text-[#DCFCE7]/45 outline-none transition focus:border-[#A3E635]/60 focus:ring-2 focus:ring-[#A3E635]/40"
                    />
                  </div>

                  {/* Submit / Cancel */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 sm:col-span-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-full bg-[#E8F3E5] px-7 py-3 font-semibold text-[#1F4D2B] shadow-lg transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving
                        ? "Saving..."
                        : editingCropId
                        ? "Update Crop"
                        : "Add Crop"}
                    </button>

                    {editingCropId && (
                      <>
                        {" "}

                        <button
                          type="button"
                          onClick={resetForm}
                          className="rounded-full border border-[#E8F3E5]/30 bg-white/5 px-7 py-3 font-semibold text-[#E8F3E5] transition hover:bg-white/10"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Messages */}
            {(message || error) && (
              <div className="mt-8">
                {message && (
                  <p className="rounded-2xl border border-[#A3E635]/20 bg-[#A3E635]/10 px-5 py-4 text-sm font-medium text-[#E8F3E5]">
                    ✓ {message}
                  </p>
                )}

                {error && (
                  <p className="mt-3 rounded-2xl border border-red-300/20 bg-red-950/20 px-5 py-4 text-sm font-medium text-red-100">
                    {error}
                  </p>
                )}
              </div>
            )}

            {/* Your Crops */}
            <div className="mt-10">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A3E635]">
                  Your garden
                </p>

                <h2 className="mt-2 font-serif text-3xl text-white sm:text-4xl">
                  Your Crops
                </h2>
              </div>

              {/* Notebook Card */}
              <div className="overflow-hidden rounded-3xl bg-[#F5F9F2] shadow-2xl">

                {loading ? (
                  <div className="px-6 py-12 text-center text-[#42634A]">
                    Loading crops...
                  </div>
                ) : crops.length === 0 ? (
                  <div className="px-6 py-16 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F3E5] text-2xl">
                      🌱
                    </div>

                    <p className="font-serif text-xl italic text-[#55715C]">
                      You have not added any crops yet.
                    </p>

                    <p className="mt-2 text-sm text-[#6B806F]">
                      Add your first crop above to start managing
                      your farm.
                    </p>
                  </div>
                ) : (
                  <div>
                    {crops.map((crop) => (
                      <div
                        key={crop._id}
                        className="border-b border-[#D9E5D7] px-6 py-7 last:border-b-0 sm:px-8"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                          {/* Crop Information */}
                          <div className="flex min-w-0 gap-4">
                            <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8F3E5] text-xl">
                              🌱
                            </div>

                            <div className="min-w-0">
                              <h3 className="font-serif text-2xl font-medium capitalize text-[#1F4D2B]">
                                {crop.name
                                  ? crop.name
                                      .charAt(0)
                                      .toUpperCase() +
                                    crop.name.slice(1)
                                  : "Crop"}
                              </h3>

                              <div className="mt-3 grid gap-x-8 gap-y-2 text-sm text-[#55715C] sm:grid-cols-2">
                                <p>
                                  <strong className="font-semibold text-[#34543B]">
                                    Variety:
                                  </strong>{" "}
                                  {crop.variety ||
                                    "Not specified"}
                                </p>

                                <p>
                                  <strong className="font-semibold text-[#34543B]">
                                    Planting Date:
                                  </strong>{" "}
                                  {crop.plantingDate
                                    ? new Date(
                                        crop.plantingDate
                                      ).toLocaleDateString()
                                    : "Not specified"}
                                </p>

                                <p>
                                  <strong className="font-semibold text-[#34543B]">
                                    Growth Stage:
                                  </strong>{" "}
                                  {crop.growthStage ||
                                    "Not specified"}
                                </p>

                                <p>
                                  <strong className="font-semibold text-[#34543B]">
                                    Location:
                                  </strong>{" "}
                                  {crop.location ||
                                    "Not specified"}
                                </p>

                                <p>
                                  <strong className="font-semibold text-[#34543B]">
                                    Farm Size:
                                  </strong>{" "}
                                  {crop.farmSize} hectares
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Crop Actions */}
                          <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(crop)
                              }
                              className="rounded-full border border-[#1F4D2B]/20 bg-white px-5 py-2 text-sm font-semibold text-[#1F4D2B] transition hover:bg-[#E8F3E5]"
                            >
                              Edit
                            </button>

                            {" "}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(crop._id)
                              }
                              className="rounded-full border border-red-200 bg-white px-5 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Crop Tools */}
                        <div className="mt-6 grid gap-4 rounded-2xl bg-[#ECF4E9] p-5 lg:grid-cols-2">
                          <div>
                            <CropImageUpload
                              cropId={crop._id}
                            />
                          </div>

                          <div>
                            <CropWeather
                              latitude={crop.latitude}
                              longitude={crop.longitude}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CropsPage;

