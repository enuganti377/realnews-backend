const axios = require("axios");
const xml2js = require("xml2js");
const News = require("../models/News");

const EnglishNews = async (req, res) => {
  try {
    
    const response = await axios.get(
      "https://feeds.bbci.co.uk/news/rss.xml"
    );

    
    const parser = new xml2js.Parser({ explicitArray: false });
    const data = await parser.parseStringPromise(response.data);

    
    const items = data.rss.channel.item;
    let count = 0;

   
    for (const item of items) {
      await News.updateOne(
        { externalId: item.link }, 
        {

        
         $setOnInsert:{
          title: item.title,
          description: item.description,
          link: item.link,
          category: "general",
          language: "en",
          source: "BBC",
          externalId: item.link,
        },
      },
        { upsert: true } 
      );

      count++;
    }

    
    res.status(200).json({
      success: true,
      message: `${count} news fetched successfully`,
    });

  } catch (error) {
    console.error("news not fetched", error.message);
    res.status(500).json({
      success: false,
      message: "RSS fetch failed",
    });
  }
};

module.exports = { EnglishNews };
