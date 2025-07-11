import axios from "axios";
import {
  KAPTURE_URL,
  KAPTURE_AUTH_TOKEN,
  INTERAKT_URL,
  INTERAKT_AUTH_TOKEN,
} from "../config/config.js";

export const sendToKapture = async (ticketData) => {
  const phone = ticketData[0].phone;
  try {
    // console.debug(
    //   `Sending to Kapture for user ${phone}: `,
    //   JSON.stringify(ticketData, null, 2)
    // );

    const response = await axios.post(KAPTURE_URL, ticketData, {
      headers: {
        Authorization: `Basic ${KAPTURE_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status !== 200) {
      throw new Error("Failed to send to Kapture");
    }

    const result = await sendInteraktMessage(phone, response.data?.ticket_id);

    // console.debug(
    //   `Response from Kapture for user ${phone}: `,
    //   JSON.stringify(response.data, null, 2)
    // );
    console.log(`Successfully sent to Kapture for user ${phone}`);
    return { crmResponseData: response.data, interaktResponseData: result };
  } catch (error) {
    console.error(`Error sending to Kapture for user ${phone}: `, error);
    throw error;
  }
};

export const sendInteraktMessage = async (phone, ticketId) => {
  const payload = {
    countryCode: "+91",
    phoneNumber: phone,
    callbackData: "Test for template",
    type: "Template",
    template: {
      name: "notification_on_ticket_from_website",
      languageCode: "en",
      headerValues: [],
      bodyValues: [ticketId],
    },
  };

  try {
    // console.debug(
    //   `Sending to Interakt for user ${phone}:`,
    //   JSON.stringify(payload, null, 2)
    // );

    const response = await axios.post(INTERAKT_URL, payload, {
      headers: {
        Authorization: `Basic ${INTERAKT_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    // console.debug(
    //   `Response from Interakt for user ${phone}:`,
    //   JSON.stringify(response.data, null, 2)
    // );
    console.log(`Successfully sent to Interakt for user ${phone}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error sending message to Interakt for user ${phone}:`,
      error
    );
    return null;
    // throw error;
  }
};
