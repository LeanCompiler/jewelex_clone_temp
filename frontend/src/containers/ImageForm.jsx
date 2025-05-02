import React, { useEffect, useState } from "react";
import {
  styled,
  Alert,
  useTheme,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CustomTextField from "../components/CustomTextField.jsx";
import StyledButton from "../components/StyledButton.jsx";
import useGlobalData from "../hooks/useGlobalData.js";
import InputFileUpload from "../components/InputFileUpload.jsx";
import SnackbarAlert from "../components/SnackbarAlert.jsx";

const PRODUCT_FETCH_URL = `${import.meta.env.VITE_PRODUCT_FETCH_URL}`;
const BACKEND_BASE_URL = `${import.meta.env.VITE_BACKEND_BASE_URL}`;

const Wrapper = styled(Grid)`
  // div {
  //   border: 1px solid red;
  // }
  // border: 1px solid red;

  height: calc(100vh - 60px);
  @media (max-width: 768px) {
    height: calc(100vh - 50px);
  }

  padding: 10px 100px;
  @media (max-width: 1400px) {
    padding: 10px 80px;
  }
  @media (max-width: 900px) {
    padding: 10px 50px;
  }
  @media (max-width: 460px) {
    padding: 10px 20px;
  }

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

  .empty-state {
    padding: 40px;
    text-align: center;
    color: #666;
  }

  .list-header-text {
    font-size: 14px;
    font-weight: 550;
  }

  .retry-button {
    margin-top: 16px;
    color: #1976d2;
    cursor: pointer;
    text-decoration: underline;
  }

  @media (max-width: 600px) {
    padding: 10px;

    .card-container {
      padding: 12px;
    }
  }
`;

const initialFormState = {
  images: [],
  remarks: "",
};

const ImageForm = () => {
  if (!PRODUCT_FETCH_URL) {
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

  if (!BACKEND_BASE_URL) {
    return (
      <Grid
        container
        size={12}
        justifyContent="center"
        alignContent={"center"}
        sx={{ height: "100vh" }}
      >
        <Alert severity="error">
          {"Missing env variable (Backend Base URL)."}
        </Alert>
      </Grid>
    );
  }

  const { globalData, setGlobalData } = useGlobalData();

  const [urlParams, setUrlParams] = useState(() => {
    const url = new URL(window.location.href);
    return {
      design_id: url.searchParams.get("design_id") || "",
      user_id: url.searchParams.get("user_id") || "",
      email: url.searchParams.get("email") || "",
      phone: url.searchParams.get("phone") || "",
    };
  });

  useEffect(() => {
    if (urlParams.user_id) {
      console.warn("Initiating JewelryForm with userId: ", urlParams.user_id);
      setGlobalData({ userId: urlParams.user_id });
    } else {
      console.warn("No userId found in URL params.");
      console.warn("Initiating JewelryForm with userId: ", globalData.userId);
    }
  }, [urlParams.user_id]);

  const theme = useTheme();
  const customTheme = createTheme({
    breakpoints: {
      values: {
        bp1: 1300,
        bp2: 1150,
        bp3: 900,
        bp4: 600,
        bp5: 400,
        ...theme.breakpoints.values,
      },
    },
  });

  const isBreakpoint1 = useMediaQuery(customTheme.breakpoints.down("bp1"));
  const isBreakpoint2 = useMediaQuery(customTheme.breakpoints.down("bp2"));
  const isBreakpoint3 = useMediaQuery(customTheme.breakpoints.down("bp3"));
  const isBreakpoint4 = useMediaQuery(customTheme.breakpoints.down("bp4"));
  const isBreakpoint5 = useMediaQuery(customTheme.breakpoints.down("bp5"));

  const [formData, setFormData] = useState(initialFormState);
  const [orders, setOrders] = useState([]);
  const [errors, setErrors] = useState({});

  const [isFetching, setIsFetching] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const validateForm = () => {
    if (!globalData.userId) {
      setAlertOpen(true);
      setMessage("User ID is required.");
      setSeverity("error");
      return false;
    }

    const isDescriptionEmpty = formData.remarks.trim() === "";
    const isFilesEmpty = formData.images.length === 0;

    if (isDescriptionEmpty && isFilesEmpty) {
      setAlertOpen(true);
      setMessage("Please provide a description or upload at least one file.");
      setSeverity("error");
      return false;
    }
    // if (!formData.remarks.trim()) {
    //   setAlertOpen(true);
    //   setMessage("Please enter description for your order.");
    //   setSeverity("error");
    //   return false;
    // }
    // if (!formData.images || formData.images.length === 0) {
    //   setAlertOpen(true);
    //   setMessage("Please add at least one file.");
    //   setSeverity("error");
    //   return false;
    // }
    if (formData.images.length > 10) {
      setAlertOpen(true);
      setMessage("You can upload a maximum of 10 files.");
      setSeverity("error");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payloadFormData = new FormData();
      payloadFormData.append("user_id", globalData.userId);
      payloadFormData.append("email", urlParams.email);
      payloadFormData.append("phone", urlParams.phone);
      payloadFormData.append("description", formData.remarks.trim());
      formData.images.forEach((file, idx) => {
        payloadFormData.append(`files`, file);
      });

      console.log(payloadFormData);

      const response = await fetch(`${BACKEND_BASE_URL}/api/order/image`, {
        method: "POST",
        body: payloadFormData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // const data = await response.json();

      setFormData(initialFormState);
      setAlertOpen(true);
      setMessage("Order submitted successfully");
      setSeverity("success");
    } catch (error) {
      console.error("Upload Error:", error);
      setAlertOpen(true);
      setMessage("Sorry something went wrong. Please try again later.");
      setSeverity("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const is900plus = useMediaQuery("(min-width:900px)");

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
        className="card-container"
        alignContent="flex-start"
        sx={
          {
            // height: "calc(100vh - 100px)",
            // position: "relative",
            // height: "100%",
          }
        }
      >
        <Grid
          container
          size={12}
          justifyContent="center"
          columnSpacing={2}
          rowSpacing={2}
          alignContent="flex-start"
        >
          <Grid container size={12} justifyContent="center">
            <CustomTextField
              value={globalData.userId}
              onChange={(e) =>
                setGlobalData({
                  ...globalData,
                  userId: String(e.target.value),
                })
              }
              label="User ID"
              error={!!errors.userId}
              helperText={errors.userId}
              focused
              fullWidth
              disabled={!!urlParams.user_id}
              size={"small"}
              slotProps={{
                htmlInput: {
                  maxLength: 50,
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  height: 36,
                },
              }}
            />
          </Grid>

          <Grid
            container
            size={{ md: 12, sm: 12, xs: 12 }}
            sx={{ paddingBottom: "10px" }}
          >
            <Grid
              container
              size={"grow"}
              justifyContent="center"
              alignContent="center"
            >
              <CustomTextField
                placeholder="Engravings, Markings, etc."
                label="Description"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    remarks: e.target.value,
                  }))
                }
                variant="outlined"
                focused
                fullWidth
                multiline
                rows={3}
                slotProps={{
                  htmlInput: {
                    maxLength: 1000,
                  },
                }}
                size={"small"}
              />
            </Grid>

            {/* <Grid container size={12} justifyContent="center">
                <p>
                  <b>Uploaded:</b>{" "}
                  {formData?.images && formData.images.length > 0
                    ? formData.images.map((file) => file.name).join(", ")
                    : "None"}
                </p>
              </Grid> */}
          </Grid>
        </Grid>

        {formData.images.length === 0 ? (
          <Grid
            container
            size={12}
            justifyContent="center"
            alignContent={"center"}
            className="empty-state"
            sx={{
              height: "calc((100vh - 60px) / 2)",
              // height: is900plus ? "300px" : "600px",
              overflowY: "scroll",
            }}
          >
            <p>
              No media added yet. Use 'Upload Files' to add Images, Videos and
              PDFs.
            </p>
          </Grid>
        ) : (
          <>
            <Grid
              container
              size={12}
              justifyContent="center"
              alignContent="flex-start"
            >
              <Grid
                container
                size={12}
                sx={{
                  padding: is900plus ? "10px 30px" : "10px 15px",
                }}
              >
                <Grid container size={3}>
                  <p style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>
                    S.No
                  </p>
                </Grid>

                <Grid container size={9}>
                  <p style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>
                    File
                  </p>
                </Grid>
              </Grid>

              <Grid
                container
                size={12}
                justifyContent="center"
                alignContent={"flex-start"}
                sx={{
                  // height: is900plus ? "300px" : "900px",
                  height: "calc((100vh - 140px) / 2)",
                  overflowY: "scroll",
                }}
              >
                {formData.images.map((image, index) => (
                  <Grid
                    key={index}
                    container
                    size={12}
                    sx={{
                      "&:not(:last-child)": {
                        borderBottom: "1px solid #626262",
                      },
                      padding: "0px 30px",
                    }}
                  >
                    <Grid container size={3} key={index}>
                      <p style={{ fontSize: 14, fontWeight: 500 }}>
                        {index + 1}
                      </p>
                    </Grid>

                    <Grid
                      container
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      size={5}
                    >
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          maxWidth: "80%",
                        }}
                      >
                        {image.name}
                      </p>
                    </Grid>

                    <Grid
                      container
                      alignItems={"center"}
                      justifyContent={"flex-end"}
                      size={4}
                    >
                      <DeleteOutlineIcon
                        sx={{ fontSize: 18 }}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter(
                              (file) => file.name !== image.name
                            ),
                          }));
                        }}
                      />
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </>
        )}

        <Grid
          container
          size={{ md: 12, sm: 12, xs: 12 }}
          justifyContent={"flex-end"}
          alignContent="center"
          alignItems={"center"}
          columnSpacing={2}
          rowSpacing={is900plus ? 2 : 1.5}
          sx={{
            // position: "absolute",
            // bottom: 0,
            padding: "10px 30px",
            paddingBottom: 0,
          }}
        >
          <Grid container size={{ md: "auto", sm: 6, xs: 12 }}>
            <InputFileUpload
              setItems={(files) =>
                setFormData((prev) => {
                  if (prev.images.length + files.length > 10) {
                    setAlertOpen(true);
                    setMessage("You can upload a maximum of 10 files.");
                    setSeverity("warning");
                    return prev;
                  } else {
                    return {
                      ...prev,
                      images: [...prev.images, ...files],
                    };
                  }
                })
              }
            />
          </Grid>

          <Grid container size={{ md: "auto", sm: 6, xs: 12 }}>
            <StyledButton
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{
                height: 36,
                textTransform: "none",
                "&:hover": {
                  "& p": {
                    textShadow: "1px 1px 3px rgba(0, 0, 0, 1)",
                  },
                },
              }}
            >
              <p className="button-text">
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </p>
            </StyledButton>
          </Grid>
        </Grid>
      </Grid>

      <SnackbarAlert
        open={alertOpen}
        setOpen={setAlertOpen}
        message={message}
        severity={severity}
      />
    </Wrapper>
  );
};

export default ImageForm;
