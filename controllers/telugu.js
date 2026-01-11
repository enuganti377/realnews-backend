const { fetchTeluguNews } = require("../services/teluguser");

const TeluguNews = async (req, res) => {
  try {
    const { category } = req.params;
    const count = await fetchTeluguNews(category);

    res.json({
      success: true,
      message: `${count} ${category} news saved`,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

module.exports = { TeluguNews };
