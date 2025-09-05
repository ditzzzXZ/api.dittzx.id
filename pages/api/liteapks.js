import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Parameter ?query= wajib" });

  try {
    const searchUrl = `https://liteapks.com/?s=${encodeURIComponent(query)}`;
    const { data } = await axios.get(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    const $ = cheerio.load(data);
    const results = [];

    $("article").each((_, el) => {
      const title = $(el).find("h2 a").text().trim();
      const link = $(el).find("h2 a").attr("href");
      const img = $(el).find("img").attr("src");

      if (title && link) {
        results.push({ title, link, logo: img });
      }
    });

    res.status(200).json({ query, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
