
import { useEffect, useState } from "react";
import { compressImage } from "../utils/imageCompression";
import {
  uploadCropImage,
  getCropImages,
} from "../api/cropImage";
import {
  analyzeCropImage,
  getCropAnalyses,
} from "../api/diseaseAnalysis";
import { addImageToQueue } from "../storage/offlineDb";
import { isOnline } from "../utils/network";

function CropImageUpload({ cropId }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [images, setImages] = useState([]);
  const [analyses, setAnalyses] = useState([]);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingImages, setLoadingImages] = useState(true);
  const [analyzingImageId, setAnalyzingImageId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadImages = async () => {
    try {
      setLoadingImages(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You must be logged in.");
      }

      if (!cropId) {
        throw new Error("Crop ID is missing.");
      }

      const [imageData, analysisData] = await Promise.all([
        getCropImages(cropId, token),
        getCropAnalyses(cropId, token),
      ]);

      setImages(imageData.images || []);
      setAnalyses(analysisData.analyses || []);
    } catch (err) {
      setError(
        err.message || "Failed to load crop images."
      );
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [cropId]);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setMessage("");
    setCompressedImage(null);
    setPreviewUrl("");
    setLoading(true);

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file.");
      }

      setSelectedImage(file);

      const compressed = await compressImage(file);

      setCompressedImage(compressed);

      const preview = URL.createObjectURL(compressed);
      setPreviewUrl(preview);

      setMessage("Image compressed successfully.");
    } catch (err) {
      setError(
        err.message || "Unable to compress image."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!compressedImage) {
      setError("Please select an image first.");
      return;
    }

    if (!cropId) {
      setError("Crop ID is missing.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError(
        "You must be logged in to upload an image."
      );
      return;
    }

    setError("");
    setMessage("");
    setUploading(true);

    try {
      // Offline: save image to IndexedDB
      if (!isOnline()) {
        await addImageToQueue({
          cropId,
          image: compressedImage,
        });

        setMessage(
          "You are offline. Image saved and will be uploaded when you are online."
        );

        return;
      }

      // Online: upload to server
      const data = await uploadCropImage(
        cropId,
        compressedImage,
        token
      );

      setMessage(
        data.message ||
          "Crop image uploaded successfully."
      );

      await loadImages();
    } catch (err) {
      setError(
        err.message || "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async (imageId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in.");
      return;
    }

    if (!cropId || !imageId) {
      setError("Crop or image information is missing.");
      return;
    }

    if (!isOnline()) {
      setError(
        "You are offline. Please connect to the internet before analyzing an image."
      );
      return;
    }

    setError("");
    setMessage("");
    setAnalyzingImageId(imageId);

    try {
      const data = await analyzeCropImage(
        cropId,
        imageId,
        token
      );

      setMessage(
        data.message ||
          "Crop image analyzed successfully."
      );

      await loadImages();
    } catch (err) {
      setError(
        err.message || "Failed to analyze crop image."
      );
    } finally {
      setAnalyzingImageId(null);
    }
  };

  const getAnalysisForImage = (imageId) => {
    return analyses.find(
      (analysis) => analysis.imageId === imageId
    );
  };

  return (
    <div>
      <h2>Upload Crop Image</h2>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageChange}
        disabled={loading || uploading}
      />

      {loading && <p>Compressing image...</p>}

      {previewUrl && (
        <div>
          <h3>Preview</h3>

          <img
            src={previewUrl}
            alt="Selected crop"
            style={{
              maxWidth: "300px",
              display: "block",
            }}
          />
        </div>
      )}

      {selectedImage && (
        <p>
          Original size:{" "}
          {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
        </p>
      )}

      {compressedImage && (
        <>
          <p>
            Compressed size:{" "}
            {(compressedImage.size / 1024 / 1024).toFixed(2)} MB
          </p>

          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </>
      )}

      {message && (
        <p style={{ color: "green" }}>
          {message}
        </p>
      )}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <hr />

      <h2>Crop Image Gallery</h2>

      {loadingImages ? (
        <p>Loading images...</p>
      ) : images.length === 0 ? (
        <p>No images uploaded for this crop yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {images.map((image) => {
            const analysis = getAnalysisForImage(
              image._id
            );

            return (
              <div key={image._id}>
                <img
                  src={image.imageUrl}
                  alt="Crop"
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />

                <p>
                  Uploaded:{" "}
                  {image.createdAt
                    ? new Date(
                        image.createdAt
                      ).toLocaleDateString()
                    : "Unknown"}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    handleAnalyze(image._id)
                  }
                  disabled={
                    analyzingImageId === image._id
                  }
                >
                  {analyzingImageId === image._id
                    ? "Analyzing..."
                    : "Analyze Image"}
                </button>

                {analysis && (
                  <div>
                    <h4>Disease Analysis</h4>

                    <p>
                      <strong>Disease:</strong>{" "}
                      {analysis.disease}
                    </p>

                    <p>
                      <strong>Confidence:</strong>{" "}
                      {(analysis.confidence * 100).toFixed(
                        0
                      )}
                      %
                    </p>

                    {analysis.explanation && (
                      <p>
                        <strong>Explanation:</strong>{" "}
                        {analysis.explanation}
                      </p>
                    )}

                    {analysis.recommendation && (
                      <p>
                        <strong>Recommendation:</strong>{" "}
                        {analysis.recommendation}
                      </p>
                    )}
                  </div>
                )}

                <hr />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CropImageUpload;

