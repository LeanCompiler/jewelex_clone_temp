export const buildKapturePayload = (
  userData,
  fileUrls = [],
  description = ""
) => {
  const { user_id, email, phone } = userData;

  const ticketInfoObj = {
    type: "",
    category: "",
    chat_link: "",
    reason: "",
    jewelery_type: "",
    remark: description,
  };

  fileUrls.forEach((url, i) => {
    ticketInfoObj[`file_${i < 10 ? `0${i + 1}` : i + 1}`] = url;
  });

  return [
    {
      title: "Order", // hard-coded
      ticket_details: "",
      due_date: "",
      customer_name: "AJP", // hard-coded
      phone,
      email_id: email,
      user_id,
      new_collections: [{ gender: "" }],
      ticket_info: [ticketInfoObj],
      webform: [{ upload_files: "", user_id: "", remarks: "" }],
      catalogs: [{ remarks: "", expedite: "", sku_number: "", quantity: "" }],
    },
  ];
};
