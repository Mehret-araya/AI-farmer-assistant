
import { uploadCropImage } from "../api/cropImage";
import {
  getPendingImages,
  updateImageStatus,
  deleteQueuedImage,
} from "./offlineDb";

export const syncPendingImages = async () => {
  if (!navigator.onLine) {
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  const pendingImages = await getPendingImages();

  for (const item of pendingImages) {
    try {
      await updateImageStatus(item.id, "uploading");

      await uploadCropImage(
        item.cropId,
        item.image,
        token
      );

      await deleteQueuedImage(item.id);

      console.log(
        `Queued image ${item.id} uploaded successfully.`
      );
    } catch (error) {
      console.error(
        `Failed to upload queued image ${item.id}:`,
        error
      );

      await updateImageStatus(item.id, "pending");
    }
  }
};

