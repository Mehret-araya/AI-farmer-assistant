import { openDB } from "idb";

const DB_NAME = "ai-farmer-assistant";
const DB_VERSION = 1;
const STORE_NAME = "imageQueue";

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      const store = db.createObjectStore(STORE_NAME, {
        keyPath: "id",
        autoIncrement: true,
      });

      store.createIndex("status", "status");
      store.createIndex("cropId", "cropId");
    }
  },
});

export const addImageToQueue = async ({
  cropId,
  image,
}) => {
  const db = await dbPromise;

  return db.add(STORE_NAME, {
    cropId,
    image,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
};

export const getPendingImages = async () => {
  const db = await dbPromise;

  return db.getAllFromIndex(
    STORE_NAME,
    "status",
    "pending"
  );
};

export const updateImageStatus = async (id, status) => {
  const db = await dbPromise;

  const image = await db.get(STORE_NAME, id);

  if (!image) {
    return;
  }

  image.status = status;

  await db.put(STORE_NAME, image);
};

export const deleteQueuedImage = async (id) => {
  const db = await dbPromise;

  return db.delete(STORE_NAME, id);
};

