import { Storage } from "@google-cloud/storage";

const configureCloudStorage = () => {
  // LOCAL DEV
  const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.PATH_TO_KEY,
  });

  // PROD
  // const storage = new Storage();

  return storage;
};

const fetchBucket = () => {
  try {
    const storage = configureCloudStorage();

    const bucketName = process.env.BUCKET_NAME;
    if (!bucketName) {
      console.log("Error fetching bucket name: env missing");
      return;
    }

    const bucket = storage.bucket(bucketName);
    if (!bucket) {
      console.log("Error fetching bucket: gcStorage error");
      return;
    }

    return bucket;
  } catch (error) {
    console.log("Error fetching bucket: ", error);
    throw error;
  }
};

export default fetchBucket;
