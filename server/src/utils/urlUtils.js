import { customAlphabet } from "nanoid";

export const generateShortUrl = (longUrl, slugLength = 6) => {
  try {
    const url = new URL(longUrl);

    const base = `${url.protocol}//${url.host}`;
    const endpoint = `${url.pathname}${url.search}`;
    const slug = generateSlug(slugLength);

    console.debug("Base:", base);
    console.debug("Endpoint:", endpoint);
    console.debug("Slug:", slug);
    console.debug("Short URL:", `${base}/${slug}`);

    return {
      base: base,
      endpoint: endpoint,
      slug: slug,
      longUrl: longUrl,
      shortUrl: `${base}/${slug}`,
    };
  } catch (error) {
    console.error("Error generating short URL: ", error);
    throw error;
  }
};

export const generateSlug = (slugLength = 6) => {
  try {
    // const slug = nanoid(slugLength);
    const ALPHABETS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alphabetNanoid = customAlphabet(ALPHABETS, slugLength);
    const slug = alphabetNanoid();

    console.debug(`Slug of size ${slugLength} generated successfully: ${slug}`);
    return slug;
  } catch (error) {
    console.error("Error generating nanoid slug: ", error);
    throw error;
  }
};
