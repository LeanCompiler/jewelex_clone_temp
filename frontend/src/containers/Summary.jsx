import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import {
  Alert,
  Box,
  CircularProgress,
  MenuItem,
  Modal,
  Paper,
  Select,
  styled,
  Typography,
} from "@mui/material";
import JewelexHeader from "../components/JewelexHeader";
import { mockSummaryDS, mockSummaryImageDS } from "../utils/mockSummaryDS";
import { DataGrid } from "@mui/x-data-grid";
import { parseUTCDate } from "../utils/utils";
import useGlobalData from "../hooks/useGlobalData";
import CustomTextField from "../components/CustomTextField";
import StyledButton from "../components/StyledButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const LEADS_FETCH_URL_1 = `${import.meta.env.VITE_LEADS_FETCH_URL_1}`;
const LEADS_FETCH_URL_2 = `${import.meta.env.VITE_LEADS_FETCH_URL_2}`;

const Wrapper = styled(Grid)`
  /*   div {
    border: 1px solid red;
  }
  border: 1px solid red; */

  min-height: 100vh;
  padding: 20px;

  .card-container {
    padding: 20px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid #e8e6e6;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    margin-bottom: 20px;
    min-height: 100px;
    position: relative;
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.8);
    z-index: 1;
  }

  .button-text {
    color: white;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 1px;
  }

  .error-text {
    color: #d32f2f;
    font-size: 12px;
    margin-top: 4px;
  }

  .retry-button {
    margin-top: 16px;
    color: #1976d2;
    cursor: pointer;
    text-decoration: underline;
  }

  @media (max-width: 600px) {
    padding: 10px;
    padding-top: 20px;
    padding-bottom: 20px;

    .card-container {
      padding: 10px;
    }
  }
`;

const Summary = ({ type = "details" }) => {
  if (!LEADS_FETCH_URL_1) {
    return (
      <Grid
        container
        size={12}
        justifyContent="center"
        alignContent={"center"}
        sx={{ height: "100vh" }}
      >
        <Alert severity="error">{"Missing env variable (Fetch URL)."}</Alert>
      </Grid>
    );
  }

  const { globalData, setGlobalData } = useGlobalData();

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const [urlParams, setUrlParams] = useState(() => {
    const url = new URL(window.location.href);
    return {
      design_id: url.searchParams.get("design_id") || "",
      user_id: url.searchParams.get("user_id") || "",
    };
  });

  /*   if (urlParams.user_id) {
    console.warn("Initiating JewelryForm with userId: ", urlParams.user_id);
    setGlobalData({ userId: urlParams.user_id });
  } else {
    console.warn("No userId found in URL params.");
    console.warn("Initiating JewelryForm with userId: ", globalData.userId);
  } */

  useEffect(() => {
    if (urlParams.user_id) {
      console.warn("Initiating JewelryForm with userId: ", urlParams.user_id);
      setGlobalData({ userId: urlParams.user_id });
    } else {
      console.warn("No userId found in URL params.");
      console.warn("Initiating JewelryForm with userId: ", globalData.userId);
    }
  }, [urlParams.user_id]);

  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const [summaryData, setSummaryData] = useState([]);

  const isValidSummaryData = (summaryData) => {
    if (!summaryData) {
      console.error("Summary data not found.");
      return [false, "Summary data not found."];
    }

    if (!Array.isArray(summaryData.rows) || summaryData.rows.length === 0) {
      console.error("Rows data is missing or not an array.");
      return [false, "Summary data is missing or not of valid format."];
    }

    if (
      !Array.isArray(summaryData.columns) ||
      summaryData.columns.length === 0
    ) {
      console.error("Columns data is missing or not an array.");
      return [false, "Meta data is missing or not of valid format."];
    }

    const columnFields = summaryData.columns.map((col) => col.field);
    for (const row of summaryData.rows) {
      for (const field of columnFields) {
        if (!(field in row)) {
          console.error(`Missing field '${field}' in row:`, row);
          return [false, `Missing field '${field}' in row.`];
        }
      }
    }

    console.log("Summary data is valid.");
    return [true, null];
  };

  const [viewImages, setViewImages] = useState([]);
  const handleClickImages = (images) => {
    setViewImages(images);
  };
  const handleClose = () => {
    setViewImages([]);
  };

  const formatForDataGrid = (summaryData) => {
    const columns = summaryData.columns;
    const rows = summaryData.rows;

    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      if (col.type === "dateTime") {
        col.valueGetter = (value) => value && parseUTCDate(value);
        col.renderCell = (params) =>
          params.value ? params.value.toUTCString() : "";
      }
      if (col.type === "text" && col.field === "images") {
        col.valueGetter = (value) => value && JSON.stringify(value);
        col.renderCell = (params) => {
          if (!params.value || params.value.length === 0) return "No Image";

          const images = JSON.parse(params.value);

          const fileNames = images.map((image) => image.name);

          return (
            <p
              style={{ margin: 0, padding: 0 }}
              onClick={() => handleClickImages(images)}
            >
              {fileNames.length > 2
                ? fileNames.slice(0, 2).join(", ") + ",..."
                : fileNames.join(", ")}
            </p>
          );
        };
      }

      switch (col.field) {
        case "quantity":
        case "size":
          col.flex = 0.5;
          break;

        case "date":
          col.flex = 1.5;
          break;

        case "images":
          col.flex = 3;
          break;

        default:
          col.flex = 1;
          break;
      }
    }

    for (let i = 0; i < rows.length; i++) {
      rows[i].id = i;
    }

    console.log("Summary Data formatted for Data Grid: ", summaryData);
    return summaryData;
  };

  const handleClickFetchSummary = () => {
    if (formData.userId) {
      setGlobalData({
        ...globalData,
        userId: String(formData.userId),
      });

      setFormData({});
    }
  };

  const fetchSummaryData = async () => {
    // // DEV start
    // const data = mockSummaryDS;
    // setSummaryData(formatForDataGrid(data));
    // return;
    // // DEV end

    try {
      if (!globalData.userId) {
        console.error("User ID not found.");
        return;
      }

      console.log("Fetching Summary Data...");

      setIsFetching(true);
      setFetchError(null);

      const url = type === "details" ? LEADS_FETCH_URL_1 : LEADS_FETCH_URL_2;

      const response = await fetch(`${url}?userID=${globalData.userId}`, {
        mode: "cors",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // const data = mockSummaryDS; // DEV
      // const data = mockSummaryImageDS; // DEV

      const data = await response.json();

      const isValid = isValidSummaryData(data);
      if (!isValid[0]) {
        console.error(isValid[1]);
        throw new Error(String(isValid[1]));
      }

      setSummaryData(formatForDataGrid(data));
      return;
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setSummaryData([]);
      setFetchError(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const handleRetry = () => {
    fetchSummaryData();
  };

  useEffect(() => {
    fetchSummaryData();
  }, [globalData.userId, type]);

  console.log("SUMMARY DATA", summaryData);

  if (!globalData.userId) {
    return (
      <Wrapper
        container
        size={12}
        justifyContent="center"
        alignContent="flex-start"
      >
        <Grid
          container
          size={12}
          justifyContent="center"
          alignContent={"center"}
          rowSpacing={1}
          className="card-container"
        >
          <Grid container size={12} justifyContent={"center"}>
            <Alert severity="error">{"User ID is required."}</Alert>
          </Grid>

          {!urlParams.user_id && (
            <Grid container size={{ md: 4, xs: 12 }} justifyContent="center">
              <CustomTextField
                value={formData.userId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                label="User ID"
                error={!!errors.userId}
                helperText={errors.userId}
                focused
                fullWidth
                disabled={urlParams.user_id}
                size={"small"}
              />
            </Grid>
          )}
        </Grid>

        {!urlParams.user_id && (
          <Grid
            container
            size={12}
            justifyContent="center"
            alignContent="center"
            sx={{ mt: 2 }}
          >
            <StyledButton
              variant="contained"
              onClick={handleClickFetchSummary}
              disabled={isFetching}
              sx={{
                height: 40,
                textTransform: "none",
                "&:hover": {
                  "& p": {
                    textShadow: "1px 1px 3px rgba(0, 0, 0, 1)",
                  },
                },
              }}
            >
              <p className="button-text">
                {isFetching ? "Fetching..." : "Fetch Summary"}
              </p>
            </StyledButton>
          </Grid>
        )}
      </Wrapper>
    );
  }

  return (
    <Wrapper
      container
      size={12}
      justifyContent="center"
      alignContent="flex-start"
    >
      <Grid container size={12} className="card-container">
        {isFetching && (
          <div className="loading-overlay">
            <CircularProgress size={30} />
          </div>
        )}

        {fetchError && (
          <Grid container size={12} rowSpacing={2} justifyContent={"center"}>
            <Grid container size={12} justifyContent="center">
              <Alert severity="error">
                {fetchError}
                {
                  <div className="retry-button" onClick={handleRetry}>
                    Click to retry
                  </div>
                }
              </Alert>
            </Grid>

            {!urlParams.user_id && (
              <>
                <Grid
                  container
                  size={{ md: 4, xs: 12 }}
                  justifyContent="center"
                >
                  <CustomTextField
                    value={formData.userId || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, userId: e.target.value })
                    }
                    label="User ID"
                    error={!!errors.userId}
                    helperText={errors.userId}
                    focused
                    fullWidth
                    disabled={urlParams.user_id}
                    size={"small"}
                  />
                </Grid>

                <Grid
                  container
                  size={12}
                  justifyContent="center"
                  alignContent="center"
                  sx={{ mt: 2 }}
                >
                  <StyledButton
                    variant="contained"
                    onClick={handleClickFetchSummary}
                    disabled={isFetching}
                    sx={{
                      height: 40,
                      textTransform: "none",
                      "&:hover": {
                        "& p": {
                          textShadow: "1px 1px 3px rgba(0, 0, 0, 1)",
                        },
                      },
                    }}
                  >
                    <p className="button-text">
                      {isFetching ? "Fetching..." : "Fetch Summary"}
                    </p>
                  </StyledButton>
                </Grid>
              </>
            )}
          </Grid>
        )}

        {summaryData?.rows && summaryData.rows.length > 0 && (
          <Paper sx={{ height: "75vh", width: "100%", boxShadow: "none" }}>
            <DataGrid
              rows={summaryData?.rows}
              columns={summaryData?.columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              localeText={{
                footerRowSelected: (count) =>
                  `${count.toLocaleString()} ${
                    count === 1 ? "lead" : "leads"
                  } listed.`,
              }}
              pageSizeOptions={[10]}
              checkboxSelection={false}
              disableRowSelectionOnClick
              sx={{
                boxShadow: "none",
                "& .MuiDataGrid-checkboxInput": {
                  color: "grey",
                  "&.Mui-checked": {
                    color: "orange",
                  },
                },
              }}
            />
          </Paper>
        )}
      </Grid>

      <Modal
        open={viewImages.length > 0}
        onClose={handleClose}
        sx={{ padding: 1 }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "white",
            padding: 4,
            paddingTop: 3,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <Grid
            container
            size={12}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              Edit Order
            </Typography>
          </Grid>

          <Grid container size={12}>
            <Grid container size={6}>
              <p style={{ fontSize: 16, fontWeight: 800 }}>S. No</p>
            </Grid>

            <Grid container size={6}>
              <p style={{ fontSize: 16, fontWeight: 800 }}>Image</p>
            </Grid>
          </Grid>

          {viewImages.map((image, index) => (
            <Grid
              container
              size={12}
              sx={{
                "&:not(:last-child)": {
                  borderBottom: "1px solid #626262",
                },
              }}
            >
              <Grid container size={6} key={index}>
                <p style={{ fontSize: 13, fontWeight: 500 }}>{index + 1}</p>
              </Grid>

              <Grid
                container
                alignItems={"center"}
                justifyContent={"space-between"}
                size={6}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    maxWidth: "80%",
                  }}
                >
                  {image.name}
                </p>

                <OpenInNewIcon
                  sx={{ fontSize: 16 }}
                  onClick={() => {
                    const url = image.url;
                    if (url) {
                      window.open(url, "_blank");
                      setTimeout(() => setSelectedValue(""), 0);
                    }
                  }}
                />
              </Grid>
            </Grid>
          ))}
        </Box>
      </Modal>
    </Wrapper>
  );
};

export default Summary;
