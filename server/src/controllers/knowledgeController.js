import AgriculturalKnowledge from "../models/AgriculturalKnowledge.js";

export const searchKnowledge = async (req, res) => {
  try {
    const { q, language = "en", disease } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const searchQuery = q.trim();

    const filter = {
      crop: "Tomato",
      language,
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
        { topic: { $regex: searchQuery, $options: "i" } },
        { tags: { $regex: searchQuery, $options: "i" } },
      ],
    };

    if (disease) {
      filter.disease = disease;
    }

    const results = await AgriculturalKnowledge.find(filter)
      .limit(5)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Knowledge search error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to search agricultural knowledge",
    });
  }
};