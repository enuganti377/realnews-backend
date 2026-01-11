const {fetchNTV} = require("../services/NTV");

const NTVNews = async (req, res) => {
  try {
    const { category } = req.params;

    const count = await fetchNTV(category);

    res.status(200).json({
      success: true,
      message: `${count} ${category} news saved`,
    });
  } catch (error) {
    console.error("NTV Controller Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch NTV news",
    });
  }
};

module.exports = {NTVNews};