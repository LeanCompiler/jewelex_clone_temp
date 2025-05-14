import axios from "axios";
import { KAPTURE_URL, KAPTURE_AUTH_TOKEN } from "../config/config.js";

export const sendToKapture = async (ticketData) => {
  const phone = ticketData[0].phone;
  try {
    console.debug(
      `Sending to Kapture for user ${phone}: `,
      JSON.stringify(ticketData, null, 2)
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
      `Response from Kapture for user ${phone}: `,
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  } catch (error) {
    console.error(`Error sending to Kapture for user ${phone}: `, error);
    throw error;
  }
};
