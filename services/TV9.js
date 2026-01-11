const axios = require("axios");
const xml2js = require("xml2js");
const News = require("../models/News");

const rssMap = {
  general: "https://tv9telugu.com/feed",
  politics: "https://tv9telugu.com/politics/feed",
  sports: "https://tv9telugu.com/sports/feed",
  cinema: "https://tv9telugu.com/entertainment/feed",
};

async function fetchTV9(category) {
  const rssurl = rssMap[category];
  if (!rssurl) return 0;

  console.log("Fetching TV9:", category);

  const response = await axios.get(rssurl);
  const parser = new xml2js.Parser({ explicitArray: false });
  const data = await parser.parseStringPromise(response.data);

  const items = data?.rss?.channel?.item?.slice(0, 5) || [];
  let count = 0;

  for (const item of items) {
    try {
      const exists = await News.findOne({
        externalId: item.link,
        source: "TV9 Telugu",
      });

      if (exists) continue;

      let imageUrl = null;

      // 1️⃣ media:content
      if (item["media:content"]?.$?.url) {
        imageUrl = item["media:content"].$.url;
      }

      // 2️⃣ enclosure
      else if (item.enclosure?.$?.url) {
        imageUrl = item.enclosure.$.url;
      }

      // 3️⃣ content:encoded (MOST IMPORTANT)
      else if (item["content:encoded"]) {
        const match = item["content:encoded"].match(
          /<img[^>]+src="([^">]+)"/
        );
        if (match) imageUrl = match[1];
      }

      // 4️⃣ description fallback
      else if (item.description) {
        const match = item.description.match(
          /<img[^>]+src="([^">]+)"/
        );
        if (match) imageUrl = match[1];
      }

      await News.create({
        title: item.title,
        description: item.description,
        imageUrl,
        link: item.link,
        category,
        language: "te",
        source: "TV9 Telugu",
        externalId: item.link,
        publishedAt: new Date(item.pubDate),
      });

      count++;
    } catch (err) {
      console.error("TV9 ERROR:", err.message);
    }
  }

  console.log(`TV9 ${category} saved:`, count);
  return count;
}

module.exports = { fetchTV9 };
