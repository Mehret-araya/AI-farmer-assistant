import { pipeline } from "@xenova/transformers";

let extractor = null;

const getExtractor = async () => {
  if (!extractor) {
    console.log("Loading local embedding model...");

    extractor = await pipeline(
      "feature-extraction",
      "Xenova/bge-m3"
    );

    console.log("Local embedding model loaded.");
  }

  return extractor;
};

export const generateEmbedding = async (text) => {
  if (!text || !text.trim()) {
    throw new Error("Text is required to generate an embedding");
  }

  const model = await getExtractor();

  const output = await model(text.trim(), {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
};