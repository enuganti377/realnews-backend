const { fetchTV9 } = require("../services/TV9");

const TV9News = async (req, res) => {
  try {
    const { category } = req.params;

    const count = await fetchTV9(category);

    res.status(200).json({
      success: true,
      message: `${count} ${category} news saved`,
    });
  } catch (error) {
    console.error("TV9 Controller Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch TV9 news",
    });
  }
};

module.exports = { TV9News };
