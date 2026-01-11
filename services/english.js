const axios = require("axios");
const xml2js = require("xml2js");
const cheerio = require("cheerio");
const News = require("../models/News");

function isBadImage(url) {
  if (!url) return true;
  const bad = ["logo", "icon", "sprite", "default"];
  return bad.some(w => url.toLowerCase().includes(w));
}

function getBBCImageFromRSS(item) {
  if (item["media:thumbnail"]?.$?.url) {
    return item["media:thumbnail"].$.url;
  }

  if (item["media:content"]?.$?.url) {
    return item["media:content"].$.url;
  }

  if (item.description) {
    const match = item.description.match(/<img[^>]+src="([^">]+)"/);
    if (match) return match[1];
  }

  return null;
}

async function extractBBCArticleImage(url) {
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
      $("article img").first().attr("src") ||
      $("img").first().attr("src");

    if (articleImg && !isBadImage(articleImg)) return articleImg;

    return null;
  } catch {
    return null;
  }
}

async function fetchEnglishNews() {
  console.log("📡 Fetching BBC English News");

  try {
    const response = await axios.get(
      "https://feeds.bbci.co.uk/news/rss.xml",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      }
    );

    const parser = new xml2js.Parser({ explicitArray: false });
    const data = await parser.parseStringPromise(response.data);

    const items = data?.rss?.channel?.item || [];
    let count = 0;

    for (const item of items) {
      try {
        let imageUrl = getBBCImageFromRSS(item);

        if (!imageUrl && item.link) {
          imageUrl = await extractBBCArticleImage(item.link);
        }

        const result = await News.updateOne(
          { externalId: item.link },
          {
            // 🔥 THIS IS THE FIX
            $set: {
              title: item.title,
              description: item.description,
              imageUrl: imageUrl || null,
              link: item.link,
              category: "general",
              language: "en",
              source: "BBC",
              publishedAt: new Date(item.pubDate || Date.now()),
            },
            $setOnInsert: {
              externalId: item.link,
            },
          },
          { upsert: true }
        );

        if (result.upsertedCount > 0) {
          count++;
        }

      } catch (err) {
        console.error("BBC item error:", err.message);
      }
    }

    console.log(`✅ BBC English saved: ${count}`);
    return count;

  } catch (error) {
    console.error("❌ BBC RSS ERROR:", error.message);
    return 0;
  }
}

module.exports = { fetchEnglishNews };
