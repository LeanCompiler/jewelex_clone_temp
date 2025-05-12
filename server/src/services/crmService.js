import axios from "axios";
import { KAPTURE_URL, KAPTURE_AUTH_TOKEN } from "../config/config.js";

export const sendToKapture = async (ticketData) => {
  const userId = ticketData[0].user_id;
  try {
    console.debug(
      `Sending to Kapture for user ${userId}: `,
      JSON.stringify(ticketData)
    );

    const response = await axios.post(KAPTURE_URL, ticketData, {
      headers: {
        Authorization: `Basic ${KAPTURE_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status !== 200) {
      throw new Error("Failed to send to Kapture");
    }

    console.debug(
      `Response from Kapture for user ${userId}: `,
      JSON.stringify(response.data)
    );
    return response.data;
  } catch (error) {
    console.error(`Error sending to Kapture for user ${userId}: `, error);
    throw error;
  }
};
