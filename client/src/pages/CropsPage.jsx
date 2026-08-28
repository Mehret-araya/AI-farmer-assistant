import { useEffect, useState } from "react";
import {
  createCrop,
  getCrops,
  updateCrop,
  deleteCrop,
} from "../api/crop";

function CropsPage() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    variety: "",
    plantingDate: "",
    growthStage: "",
    location: "",
    farmSize: "",
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
      variety: "",
      plantingDate: "",
      growthStage: "",
      location: "",
      farmSize: "",
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
        name: "tomato",
        variety: formData.variety,
        plantingDate: formData.plantingDate,
        growthStage: formData.growthStage,
        location: formData.location,
        farmSize: Number(formData.farmSize) || 0,
      };

      if (editingCropId) {
        await updateCrop(editingCropId, cropData, token);
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
      variety: crop.variety || "",
      plantingDate: crop.plantingDate
        ? crop.plantingDate.split("T")[0]
        : "",
      growthStage: crop.growthStage || "",
      location: crop.location || "",
      farmSize: crop.farmSize ?? "",
    });

    setMessage("");
    setError("");
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
    <div>
      <h1>My Crops</h1>

      <p>Manage your tomato crops.</p>

      <hr />

      <h2>{editingCropId ? "Edit Crop" : "Add Tomato Crop"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="variety">Variety</label>
          <br />
          <input
            id="variety"
            name="variety"
            type="text"
            value={formData.variety}
            onChange={handleChange}
            placeholder="e.g. Roma"
          />
        </div>

        <br />

        <div>
          <label htmlFor="plantingDate">Planting Date</label>
          <br />
          <input
            id="plantingDate"
            name="plantingDate"
            type="date"
            value={formData.plantingDate}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="growthStage">Growth Stage</label>
          <br />
          <select
            id="growthStage"
            name="growthStage"
            value={formData.growthStage}
            onChange={handleChange}
          >
            <option value="">Select stage</option>
            <option value="Seedling">Seedling</option>
            <option value="Vegetative">Vegetative</option>
            <option value="Flowering">Flowering</option>
            <option value="Fruiting">Fruiting</option>
            <option value="Harvest">Harvest</option>
          </select>
        </div>

        <br />

        <div>
          <label htmlFor="location">Location</label>
          <br />
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Addis Ababa"
          />
        </div>

        <br />

        <div>
          <label htmlFor="farmSize">Farm Size</label>
          <br />
          <input
            id="farmSize"
            name="farmSize"
            type="number"
            min="0"
            step="0.01"
            value={formData.farmSize}
            onChange={handleChange}
            placeholder="e.g. 2"
          />
        </div>

        <br />

        <button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : editingCropId
            ? "Update Crop"
            : "Add Crop"}
        </button>

        {editingCropId && (
          <>
            {" "}
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          </>
        )}
      </form>

      <br />

      {message && <p style={{ color: "green" }}>{message}</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />

      <h2>Your Crops</h2>

      {loading ? (
        <p>Loading crops...</p>
      ) : crops.length === 0 ? (
        <p>You have not added any crops yet.</p>
      ) : (
        <div>
          {crops.map((crop) => (
            <div key={crop._id}>
              <h3>🍅 {crop.name}</h3>

              <p>
                <strong>Variety:</strong>{" "}
                {crop.variety || "Not specified"}
              </p>

              <p>
                <strong>Planting Date:</strong>{" "}
                {crop.plantingDate
                  ? new Date(crop.plantingDate).toLocaleDateString()
                  : "Not specified"}
              </p>

              <p>
                <strong>Growth Stage:</strong>{" "}
                {crop.growthStage || "Not specified"}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {crop.location || "Not specified"}
              </p>

              <p>
                <strong>Farm Size:</strong>{" "}
                {crop.farmSize} hectares
              </p>

              <button type="button" onClick={() => handleEdit(crop)}>
                Edit
              </button>{" "}

              <button
                type="button"
                onClick={() => handleDelete(crop._id)}
              >
                Delete
              </button>

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CropsPage;