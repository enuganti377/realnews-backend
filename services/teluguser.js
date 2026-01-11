const axios = require("axios");
const xml2js = require("xml2js");
const cheerio = require("cheerio");
const News = require("../models/News");

const rssMap = {
  general: "https://telugu.abplive.com/home/feed",
  politics: "https://telugu.abplive.com/politics/feed",
  sports: "https://telugu.abplive.com/sports/feed",
  cinema: "https://telugu.abplive.com/entertainment/feed",
};

function isBadImage(url) {
  if (!url) return true;
  const bad = ["logo", "icon", "sprite", "default"];
  return bad.some(w => url.toLowerCase().includes(w));
}

async function extractABPArticleImage(url) {
  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/120",
      },
    });

    const $ = cheerio.load(data);

    const ogImage = $('meta[property="og:image"]').attr("content");
    if (ogImage && !isBadImage(ogImage)) return ogImage;

    const articleImg =
      $(".article-content img").first().attr("src") ||
      $("article img").first().attr("src");

    if (articleImg && !isBadImage(articleImg)) return articleImg;

    return null;
  } catch {
    return null;
  }
}

async function fetchTeluguNews(category) {
  const rssUrl = rssMap[category];
  if (!rssUrl) return 0;

  const response = await axios.get(rssUrl, { timeout: 15000 });
  const parser = new xml2js.Parser({ explicitArray: false });
  const data = await parser.parseStringPromise(response.data);

  const items = data?.rss?.channel?.item?.slice(0, 5) || [];
  let count = 0;

  for (const item of items) {
    try {
      let imageUrl = null;

      // 1️⃣ Try RSS image (rare)
      if (item["media:content"]?.$?.url) {
        imageUrl = item["media:content"].$.url;
      } else if (item.enclosure?.$?.url) {
        imageUrl = item.enclosure.$.url;
      }

      // 2️⃣ Fallback: scrape article page (REAL FIX)
      if (!imageUrl && item.link) {
        imageUrl = await extractABPArticleImage(item.link);
      }

      await News.updateOne(
        { externalId: item.link },
        {
          $setOnInsert: {
            title: item.title,
            description: item.description,
            link: item.link,
            category,
            language: "te",
            source: "ABP Telugu",
            externalId: item.link,
            publishedAt: new Date(item.pubDate),
            imageUrl: imageUrl || null,
          },
        },
        { upsert: true }
      );

      count++;
    } catch (err) {
      console.log("Skip article:", item.link);
    }
  }

  console.log(`ABP Telugu ${category} saved:`, count);
  return count;
}

module.exports = { fetchTeluguNews };
