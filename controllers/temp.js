const News = require("../models/News");

const postnews = async (req, res) => {
  try {
    const { title, discripation, imageurl, category, source } = req.body;

    
    if (!title || !discripation || !category) {
      return res.status(400).json({
        success: false,
        message: "title, discripation, and category are required",
      });
    }

   
    const news = await News.create({
      title,
      discripation,
      imageurl,
      category,
      source,
    });

    return res.status(201).json({
      success: true,
      message: "News posted successfully",
      data: news,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to post news",
    });
  }
};

module.exports = { postnews };
