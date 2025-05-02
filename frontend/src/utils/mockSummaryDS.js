export const mockSummaryDS = {
  columns: [
    {
      field: "user_id",
      headerName: "User ID",
      type: "number",
    },
    {
      field: "design_id",
      headerName: "Design ID",
      type: "text",
    },
    {
      field: "product_name",
      headerName: "Product Name",
      type: "text",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
    },
    {
      field: "metal_type",
      headerName: "Metal Type",
      type: "text",
    },
    {
      field: "size",
      headerName: "Size",
      type: "text",
    },
    {
      field: "markings",
      headerName: "Markings",
      type: "text",
    },
    {
      field: "date",
      headerName: "Date",
      type: "dateTime",
    },
  ],
  rows: [
    {
      user_id: 1,
      design_id: 1002,
      product_name: "Ring Design 2",
      quantity: null,
      metal_type: null,
      size: null,
      markings: null,
      date: null,
    },
    {
      user_id: 2,
      design_id: 1001,
      product_name: "Ring Design 1",
      quantity: 100,
      metal_type: "Gold",
      size: "M",
      markings: "Test",
      date: "27-01-2025 07:45:31 UTC",
    },
    {
      user_id: 3,
      design_id: 6337,
      product_name: "Gents Ring",
      quantity: 1,
      metal_type: "Gold",
      size: 19,
      markings: "Test ABM",
      date: "27-01-2025 07:54:46 UTC",
    },
    {
      user_id: 4,
      design_id: 5592,
      product_name: "LMC5592SS",
      quantity: 10,
      metal_type: "Gold",
      size: 21,
      markings: "Test",
      date: "27-01-2025 08:05:16 UTC",
    },
    {
      user_id: 5,
      design_id: 3055,
      product_name: "LMS3055SS",
      quantity: 10,
      metal_type: "Platinum",
      size: 20,
      markings: "STB Phone Test",
      date: "27-01-2025 08:17:01 UTC",
    },
    {
      user_id: 6,
      design_id: 3055,
      product_name: "LMS3055SS",
      quantity: 10,
      metal_type: "Platinum",
      size: 19,
      markings: "",
      date: "27-01-2025 08:19:08 UTC",
    },
    {
      user_id: 7,
      design_id: 3055,
      product_name: "LMS3055SS",
      quantity: 100,
      metal_type: "Platinum",
      size: 22,
      markings: "",
      date: "27-01-2025 08:20:31 UTC",
    },
  ],
};

export const mockSummaryImageDS = {
  columns: [
    {
      field: "user_id",
      headerName: "User ID",
      type: "number",
    },
    {
      field: "images",
      headerName: "Images",
      type: "text",
    },
    {
      field: "remarks",
      headerName: "Remarks",
      type: "text",
    },
    {
      field: "date",
      headerName: "Date",
      type: "dateTime",
    },
  ],
  rows: [
    {
      user_id: 1,
      images: [
        {
          name: "Obi estimates.jpg",
          url: "https://storage.googleapis.com/comportement-sandbox.appspot.com/jewelex/orders/524/1742813515015-0-0.jpg",
        },
        {
          name: "Obi ola.jpg",
          url: "https://storage.googleapis.com/comportement-sandbox.appspot.com/jewelex/orders/524/1742813515024-0-1.jpg",
        },
        {
          name: "Obi uber.jpg",
          url: "https://storage.googleapis.com/comportement-sandbox.appspot.com/jewelex/orders/524/1742813515025-0-2.jpg",
        },
      ],
      remarks: "Test",
      date: "27-01-2025 07:45:31 UTC",
    },
  ],
};
