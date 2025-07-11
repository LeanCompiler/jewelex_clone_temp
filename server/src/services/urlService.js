import Url from "../models/Url.js";
import { generateShortUrl } from "../utils/urlUtils.js";

export async function createUrl(url, slugLength = 6) {
  try {
    let retries = 5;
    let createdUrl = null;

    while (retries--) {
      const { base, endpoint, slug, longUrl, shortUrl } = generateShortUrl(
        url,
        slugLength
      );

      try {
        createdUrl = await Url.create({
          slug: slug,
          base: base,
          endpoint: endpoint,
        });
        break;
      } catch (err) {
        if (err.name === "SequelizeUniqueConstraintError") {
          console.log("Slug already exists. Retrying...");
          continue;
        }
        throw err;
      }
    }

    if (!createdUrl) {
      throw new Error("Failed to create short URL after retries.");
    }

    return createdUrl;
  } catch (error) {
    console.error("Error creating short URL: ", error);
    throw error;
  }
}

export const readUrl = async (shortUrl, longUrl) => {
  try {
    const url = new URL(longUrl ? longUrl : shortUrl);

    const base = `${url.protocol}//${url.host}`;
    const endpoint = `${url.pathname}${url.search}`;

    const where = { base: base, is_active: true };
    if (shortUrl) {
      where.slug = endpoint.slice(1);
    }
    if (longUrl) {
      where.endpoint = endpoint;
    }

    const result = await Url.findOne({
      where: where,
      order: [["created_at", "DESC"]],
    });

    // console.debug(
    //   `URL found for criteria ${JSON.stringify(where, null, 2)}: ${JSON.stringify(result?.dataValues, null, 2)}`
    // );
    return result;
  } catch (error) {
    console.error("Error in readUrl:", error);
    throw error;
  }
};

export const getAllUrls = async (limit = 10, offset = 0) => {
  try {
    const result = await Url.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["created_at", "DESC"]],
    });

    return {
      count: result.count,
      rows: result.rows,
    };
  } catch (error) {
    console.error("Error in getAllUrls:", error);
    throw error;
  }
};
