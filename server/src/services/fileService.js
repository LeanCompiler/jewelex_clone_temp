import path from "path";
import fs from "fs/promises";
import { chmod } from "fs/promises";
import { createReadStream } from "fs";
import { pipeline } from "stream/promises";
import { setTimeout as delay } from "timers/promises";
import { UPLOADS_WRITE_DIR } from "../config/config.js";

const MAX_WRITE_RETRIES = 2;

export const saveFilesToDisk = async (files, userId) => {
  const fileNames = [];

  try {
    await fs.mkdir(UPLOADS_WRITE_DIR, { recursive: true, mode: 0o755 }); // safe dir perms
  } catch (err) {
    console.error(
      `Could not create directory for user ${userId}: ${UPLOADS_WRITE_DIR}`,
      err
    );
    throw err;
  }

  const tasks = files.map(async (file) => {
    const fileName = `U_${userId}-${file.filename}`;
    const destPath = path.join(UPLOADS_WRITE_DIR, fileName);
    let retries = 0;

    while (retries <= MAX_WRITE_RETRIES) {
      try {
        const { size } = await fs.stat(file.path);
        console.debug(
          `Attempt ${retries + 1}: Saving file for user ${userId}: ${fileName} (${(size / 1024).toFixed(2)} KB)`
        );

        await pipeline(
          createReadStream(file.path),
          await fs.open(destPath, "w").then((fh) => {
            const ws = fh.createWriteStream();
            ws.on("finish", async () => {
              await chmod(destPath, 0o644); // safe file perms
            });
            return ws;
          })
        );

        fileNames.push(fileName);
        break; // success
      } catch (err) {
        console.error(
          `Write failed for file ${fileName}, for user ${userId}, attempt ${retries + 1}`,
          err
        );
        if (retries === MAX_WRITE_RETRIES) {
          console.error(`Giving up on file ${fileName}`);
        } else {
          await delay(300); // delay and retry
        }
        retries++;
      }
    }

    try {
      await fs.unlink(file.path); // clean up temp
    } catch (unlinkErr) {
      console.warn(`Temp file cleanup failed: ${file.path}`, unlinkErr);
    }
  });

  await Promise.allSettled(tasks); // wait for all to finish
  return fileNames;
};
