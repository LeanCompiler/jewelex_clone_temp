import { ADMIN_KEY } from "../config/config.js";
import { createUrl, getAllUrls, readUrl } from "../services/urlService.js";

export const createShortUrl = async (req, res, next) => {
  try {
    const { url, target_length = 3 } = req.body;
    if (!url) {
      return res
        .status(400)
        .json({ success: false, message: "URL is required" });
    }
    try {
      new URL(url);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid URL" });
    }

    const existing = await readUrl(null, url);
    if (existing) {
      return res.status(200).json({
        success: false,
        message: "URL already exists",
        data: {
          long_url: existing.base + existing.endpoint,
          short_url: existing.base + "/" + existing.slug,
          expires_at: existing.expires_at,
        },
      });
    }

    const created = await createUrl(url, target_length);

    console.info(
      `Short URL created successfully: ${created.base + "/" + created.slug} for long URL: ${url}`
    );
    return res.status(201).json({
      success: true,
      message: `Short URL created successfully: ${created.base + "/" + created.slug} for long URL: ${url}`,
      data: {
        long_url: created.base + created.endpoint,
        short_url: created.base + "/" + created.slug,
        expires_at: created.expires_at,
      },
    });
  } catch (error) {
    console.error("Error in createShortUrl:", error);
    next(error);
  }
};

export const getUrl = async (req, res, next) => {
  try {
    const { short_url: shortUrl, long_url: longUrl } = req.query;
    if (!shortUrl && !longUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Short URL or Long URL is required" });
    }
    if (shortUrl && longUrl) {
      return res.status(400).json({
        success: false,
        message: "Only one of Short URL or Long URL is required",
      });
    }

    const url = shortUrl || longUrl;
    try {
      new URL(url);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid URL" });
    }

    const found = await readUrl(shortUrl, longUrl);
    if (!found) {
      return res.status(404).json({ success: false, message: "URL not found" });
    }

    console.debug(`URL found: ${JSON.stringify(found.dataValues, null, 2)}`);
    return res.status(200).json({
      success: true,
      message: "URL found",
      data: {
        long_url: found.base + found.endpoint,
        short_url: found.base + "/" + found.slug,
        expires_at: found.expires_at,
      },
    });
  } catch (error) {
    console.error("Error in getUrl:", error);
    next(error);
  }
};

export const getUrls = async (req, res, next) => {
  try {
    const { admin_key: adminKey, limit = 10, offset = 0 } = req.query;
    if (!adminKey || adminKey !== ADMIN_KEY) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const urls = await getAllUrls(limit, offset);

    return res.status(200).json({
      success: true,
      message: "URLs found",
      data: urls,
    });
  } catch (error) {
    console.error("Error in getUrls:", error);
    next(error);
  }
};
