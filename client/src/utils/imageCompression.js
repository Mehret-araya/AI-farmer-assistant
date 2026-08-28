import imageCompression from "browser-image-compression";

export const compressImage = async (file) => {
  if (!file) {
    throw new Error("No image file provided");
  }

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 800,
    useWebWorker: true,
    fileType: "image/webp",
  };

  const compressedFile = await imageCompression(file, options);

  return compressedFile;
};