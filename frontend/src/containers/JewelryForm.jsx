import React, { useEffect, useState, useCallback } from "react";
import {
  CircularProgress,
  IconButton,
  styled,
  Alert,
  Snackbar,
  Tooltip,
  useTheme,
  createTheme,
  useMediaQuery,
  Modal,
  Box,
  Typography,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CustomSelect from "../components/CustomSelect.jsx";
import QuantitySelector from "../components/QuantitySelector.jsx";
import CustomTextField from "../components/CustomTextField.jsx";
import StyledButton from "../components/StyledButton.jsx";
import { formatDate } from "../utils/utils.js";
import useGlobalData from "../hooks/useGlobalData.js";
import SearchableSelect from "../components/SearchableSelect.jsx";

const PRODUCT_FETCH_URL = `${import.meta.env.VITE_PRODUCT_FETCH_URL}`;
const SUBMIT_LEAD_URL = `${import.meta.env.VITE_SUBMIT_LEAD_URL}`;

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
    padding-top: 20px;
    padding-bottom: 20px;

    .card-container {
      padding: 10px;
    }
  }
`;

const initialFormState = {
  jeweleryMaterial: "",
  quantity: 1,
  size: "",
  remarks: "",
};

const JewelryForm = () => {
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

  if (!SUBMIT_LEAD_URL) {
    return (
      <Grid
        container
        size={12}
        justifyContent="center"
        alignContent={"center"}
        sx={{ height: "100vh" }}
      >
        <Alert severity="error">{"Missing env variable (Submit URL)."}</Alert>
      </Grid>
    );
  }

  const { globalData, setGlobalData } = useGlobalData();

  const [urlParams, setUrlParams] = useState(() => {
    const url = new URL(window.location.href);
    return {
      design_id: url.searchParams.get("design_id") || "",
      user_id: url.searchParams.get("user_id") || "",
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

  const [selectedProductId, setSelectedProductId] = useState(
    urlParams.design_id
  );

  const [productIds, setProductIds] = useState([]);
  const [productName, setProductName] = useState("");
  const [jeweleryMaterials, setJeweleryMaterials] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [formData, setFormData] = useState(initialFormState);
  const [orders, setOrders] = useState([]);
  const [errors, setErrors] = useState({});

  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editOrder, setEditOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = (order) => {
    setEditOrder(order);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const fetchProductData = async () => {
    try {
      setIsFetching(true);
      setFetchError(null);

      console.log("Selected Product ID: ", selectedProductId);

      const response = await fetch(
        `${PRODUCT_FETCH_URL}?prodid=${selectedProductId}`,
        {
          mode: "cors",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // UNCOMMENT ON PROD
      const data = await response.json();

      // // DEV start
      // let data = await response.json();
      // data.product_ids = ["A", "B", "C", "LMC6337S"];
      // // DEV end

      if (!data) {
        console.error("Invalid data received: ", data);
        setFetchError("Invalid data received");

        throw new Error("Invalid data received");
      }

      if (
        !data?.product_ids ||
        !Array.isArray(data.product_ids) ||
        !data.product_ids.length > 0
      ) {
        console.error("Invalid data received for product_ids: ", data);
        setFetchError("Invalid data received for product_ids");

        return;
      }

      const productIds = data.product_ids.map((item, index) => ({
        id: index,
        label: item,
        value: item,
      }));
      setProductIds(productIds);

      if (!data?.product_name || !data?.metal_type || !data?.size) {
        console.error(
          "Invalid data received for product_id " +
            selectedProductId +
            " data: " +
            JSON.stringify(data)
        );
        // setFetchError(
        //   "Invalid data received for product_id " +
        //     selectedProductId +
        //     " data: "
        // );
        setSnackbar({
          open: true,
          message:
            "Invalid data received for product_id " +
            selectedProductId +
            " data: ",
          severity: "error",
        });

        return;
      }

      setSnackbar({
        open: true,
        message:
          "Successfully fetched data for product_id " + selectedProductId,
        severity: "success",
      });

      setProductName(data.product_name);
      setJeweleryMaterials(data.metal_type);
      setSizes(data.size);
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchError(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.jeweleryMaterial) {
      newErrors.jeweleryMaterial = "Please select a material";
    }
    if (formData.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    }
    if (!formData.size) {
      newErrors.size = "Please select a size";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrder = () => {
    if (validateForm()) {
      setOrders((prev) => [...prev, { ...formData, id: Date.now() }]);
      setFormData(initialFormState);
      setErrors({});
      setSnackbar({
        open: true,
        message: "Item added successfully",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: Object.entries(errors)
          .map(([key, value]) => `${value}`)
          .join(", "),
        severity: "error",
      });
    }
  };

  const handleEditOrder = (id, updatedOrder) => {
    try {
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? updatedOrder : order))
      );
      handleClose();

      setSnackbar({
        open: true,
        message: "Item updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating order:", error);
      setSnackbar({
        open: true,
        message: "Failed to update item",
        severity: "error",
      });
    }
  };

  const handleDeleteOrder = (id) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
    setSnackbar({
      open: true,
      message: "Item removed from order",
      severity: "info",
    });
  };

  const handleSubmit = async () => {
    if (orders.length === 0) {
      setErrors({ submit: "Please add at least one item to your order" });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        user_id: globalData.userId,
        design_id: selectedProductId,
        product_name: productName,
        date: formatDate(new Date()),
        orders: orders.map((order) => ({
          metal_type: order.jeweleryMaterial,
          qty: order.quantity,
          size: order.size,
          markings: order.remarks,
        })),
      };

      console.log(payload);

      const response = await fetch(SUBMIT_LEAD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(payload),
      });

      setOrders([]);
      setFormData(initialFormState);
      setSnackbar({
        open: true,
        message: "Order submitted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error submitting order:", error);
      setSnackbar({
        open: true,
        message: "Failed to submit order. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    fetchProductData();
  };

  useEffect(() => {
    fetchProductData(selectedProductId);
  }, [selectedProductId]);

  const EditOrderForm = ({ order }) => {
    console.log(order);
    const [editData, setEditData] = useState(order);

    return (
      <>
        <Grid
          container
          size={12}
          alignItems={"center"}
          justifyContent={"space-between"}
          sx={{
            marginBottom: 3,
          }}
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
          <EditIcon />
        </Grid>

        <Grid
          container
          size={12}
          justifyContent="center"
          columnSpacing={2}
          rowSpacing={3}
          sx={{ padding: 1 }}
        >
          <Grid
            container
            size={12}
            justifyContent="center"
            alignContent="center"
          >
            <CustomSelect
              attribute={editData.jeweleryMaterial}
              setAttribute={(value) =>
                setEditData((prev) => ({
                  ...prev,
                  jeweleryMaterial: value,
                }))
              }
              items={jeweleryMaterials}
              label="Material"
            />
          </Grid>

          <Grid
            container
            size={6}
            justifyContent="center"
            alignContent="center"
          >
            <QuantitySelector
              quantity={editData.quantity}
              setQuantity={(value) =>
                setEditData((prev) => ({ ...prev, quantity: value }))
              }
            />
          </Grid>

          <Grid
            container
            size={6}
            justifyContent="center"
            alignContent="center"
          >
            <CustomSelect
              attribute={editData.size}
              setAttribute={(value) =>
                setEditData((prev) => ({ ...prev, size: value }))
              }
              items={sizes}
              label="Size"
            />
          </Grid>

          <Grid
            container
            size={12}
            justifyContent="center"
            alignContent="center"
          >
            <CustomTextField
              placeholder="Engravings, Markings, etc."
              label="Remarks"
              value={editData.remarks}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  remarks: e.target.value,
                }))
              }
              variant="outlined"
              focused
              fullWidth
              multiline
              rows={2}
              maxRows={5}
            />
          </Grid>

          <Grid
            container
            size={12}
            columnSpacing={7}
            justifyContent="center"
            alignContent="center"
            sx={{ marginTop: 1 }}
          >
            <Button variant="contained" color="red" onClick={handleClose}>
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                handleEditOrder(order.id, editData);
              }}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </>
    );
  };

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

        {fetchError ? (
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
        ) : (
          <Grid
            container
            size={12}
            justifyContent="center"
            columnSpacing={2}
            rowSpacing={2}
            sx={{ padding: 1 }}
          >
            <Grid container size={{ md: 4, xs: 12 }} justifyContent="center">
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
                disabled={urlParams.user_id}
                size={"small"}
              />
            </Grid>

            <Grid
              container
              size={{ md: 4, sm: 12, xs: 12 }}
              justifyContent="center"
              alignContent="center"
            >
              <SearchableSelect
                attribute={selectedProductId}
                setAttribute={setSelectedProductId}
                items={productIds}
                label="Product ID"
              />
              {/*  <CustomSelect
                attribute={selectedProductId}
                setAttribute={setSelectedProductId}
                items={productIds}
                label="Product ID"
                error={!!errors.productId}
                helperText={errors.productId}
              /> */}
            </Grid>

            <Grid container size={{ md: 4, xs: 12 }} justifyContent="center">
              <CustomTextField
                value={productName}
                //   onChange={(e) => setProductName(e.target.value)}
                label="Product Name"
                error={!!errors.productName}
                helperText={errors.productName}
                disabled
                focused
                fullWidth
                size={"small"}
              />
            </Grid>

            <Grid
              container
              size={{ md: 4, sm: 6, xs: 12 }}
              justifyContent="center"
              alignContent="center"
            >
              <CustomSelect
                attribute={formData.jeweleryMaterial}
                setAttribute={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    jeweleryMaterial: value,
                  }))
                }
                items={jeweleryMaterials}
                label="Material"
                error={!!errors.jeweleryMaterial}
                helperText={errors.jeweleryMaterial}
              />
            </Grid>

            <Grid
              container
              size={{ md: 1, sm: 3, xs: 6 }}
              justifyContent="center"
              alignContent="center"
            >
              <QuantitySelector
                quantity={formData.quantity}
                setQuantity={(value) =>
                  setFormData((prev) => ({ ...prev, quantity: value }))
                }
                error={!!errors.quantity}
              />
              {errors.quantity && (
                <div className="error-text">{errors.quantity}</div>
              )}
            </Grid>

            <Grid
              container
              size={{ md: 1, sm: 3, xs: 6 }}
              justifyContent="center"
              alignContent="center"
            >
              <CustomSelect
                attribute={formData.size}
                setAttribute={(value) =>
                  setFormData((prev) => ({ ...prev, size: value }))
                }
                items={sizes}
                label="Size"
                error={!!errors.size}
                helperText={errors.size}
              />
            </Grid>

            <Grid
              container
              size={{ md: 6, sm: 12, xs: 12 }}
              justifyContent="center"
              alignContent="center"
            >
              <CustomTextField
                placeholder="Engravings, Markings, etc."
                label="Remarks"
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
                size={"small"}
              />
            </Grid>

            <Grid
              container
              size={{ md: 0.5, sm: 2 }}
              justifyContent="center"
              alignContent="center"
            >
              <IconButton onClick={handleAddOrder} disabled={isSubmitting}>
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
        )}
      </Grid>

      <Grid container size={12} className="card-container">
        {orders.length === 0 ? (
          <Grid
            container
            size={12}
            justifyContent="center"
            className="empty-state"
          >
            <p>No items added to order yet. Use the form above to add items.</p>
          </Grid>
        ) : (
          <>
            <Grid container size={12} justifyContent="center">
              <Grid
                container
                size={12}
                justifyContent={isBreakpoint4 ? "space-between" : "center"}
              >
                <Grid
                  container
                  size={2}
                  justifyContent="center"
                  alignContent="center"
                >
                  <p className="list-header-text">Material</p>
                </Grid>
                <Grid
                  container
                  size={2}
                  justifyContent="center"
                  alignContent="center"
                >
                  <p className="list-header-text">Size</p>
                </Grid>
                <Grid
                  container
                  size={2}
                  justifyContent="center"
                  alignContent="center"
                >
                  <p className="list-header-text">Quantity</p>
                </Grid>
                <Grid
                  container
                  size={2}
                  justifyContent="center"
                  alignContent="center"
                >
                  <p className="list-header-text">Remarks</p>
                </Grid>
                <Grid
                  container
                  size={isBreakpoint3 ? 3 : 1}
                  justifyContent="center"
                  alignContent="center"
                />
              </Grid>
            </Grid>

            <Grid
              container
              size={12}
              justifyContent="center"
              sx={{ maxHeight: "40vh", overflowY: "auto" }}
            >
              {orders.map((order) => {
                const material = jeweleryMaterials.find(
                  (m) => m.value === order.jeweleryMaterial
                )?.label;
                return (
                  <Grid
                    key={order.id}
                    container
                    size={12}
                    justifyContent={isBreakpoint4 ? "space-between" : "center"}
                  >
                    <Grid
                      container
                      size={2}
                      justifyContent="center"
                      alignContent="center"
                    >
                      <Tooltip
                        title={material || "-"}
                        arrow
                        placement="top-start"
                        disableInteractive
                        enterTouchDelay={0}
                        leaveTouchDelay={3000}
                      >
                        <p
                          style={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            maxWidth: "90%",
                          }}
                        >
                          {material || "-"}
                        </p>
                      </Tooltip>
                    </Grid>
                    <Grid
                      container
                      size={2}
                      justifyContent="center"
                      alignContent="center"
                    >
                      <Tooltip
                        title={order.size || "-"}
                        arrow
                        placement="top-start"
                        disableInteractive
                        enterTouchDelay={0}
                        leaveTouchDelay={3000}
                      >
                        <p
                          style={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            maxWidth: "90%",
                          }}
                        >
                          {order.size || "-"}
                        </p>
                      </Tooltip>
                    </Grid>
                    <Grid
                      container
                      size={2}
                      justifyContent="center"
                      alignContent="center"
                    >
                      <p>{order.quantity}</p>
                    </Grid>
                    <Grid
                      container
                      size={2}
                      justifyContent="center"
                      alignContent="center"
                    >
                      <Tooltip
                        title={order.remarks || "-"}
                        arrow
                        placement="top-start"
                        disableInteractive
                        enterTouchDelay={0}
                        leaveTouchDelay={3000}
                      >
                        <p
                          style={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            maxWidth: "90%",
                          }}
                        >
                          {order.remarks || "-"}
                        </p>
                      </Tooltip>
                    </Grid>
                    <Grid
                      container
                      size={isBreakpoint3 ? 3 : 1}
                      justifyContent={"space-around"}
                      alignContent="center"
                    >
                      <IconButton onClick={() => handleOpen(order)}>
                        <EditIcon
                          fontSize={isBreakpoint4 ? "small" : "medium"}
                        />
                      </IconButton>

                      <IconButton onClick={() => handleDeleteOrder(order.id)}>
                        <DeleteOutlineIcon
                          fontSize={isBreakpoint4 ? "small" : "medium"}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}
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
          onClick={handleSubmit}
          disabled={isSubmitting || orders.length === 0 || isFetching}
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
            {isSubmitting ? "Submitting..." : "Submit Order"}
          </p>
        </StyledButton>
      </Grid>

      <Modal open={open} onClose={handleClose} sx={{ padding: 1 }}>
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
          <EditOrderForm order={editOrder} />
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Wrapper>
  );
};

export default JewelryForm;
