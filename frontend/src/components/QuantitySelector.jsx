import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CustomTextField from "./CustomTextField.jsx";

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "black",
            },
          },
          "& .MuiInputLabel-root": {
            color: "black",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "black",
          },
        },
      },
    },
  },
});

function QuantitySelector({ quantity, setQuantity, min = 1, max = 100 }) {
  const handleIncrement = () => {
    if (quantity < max) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > min) {
      setQuantity(quantity - 1);
    }
  };

  const handleInputChange = (event) => {
    const value = Number(event.target.value);
    if (value >= min && value <= max) {
      setQuantity(value);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* <IconButton onClick={handleDecrement} disabled={quantity <= min}>
          <Remove />
        </IconButton> */}
      <CustomTextField
        type="number"
        value={quantity}
        onChange={handleInputChange}
        inputProps={{
          min,
          max,
          style: { textAlign: "center" },
        }}
        //   size="small"
        variant="outlined"
        focused
        fullWidth
        label="Quantity"
        size={"small"}
      />
      {/*    <IconButton onClick={handleIncrement} disabled={quantity >= max}>
          <Add />
        </IconButton> */}
    </ThemeProvider>
  );
}

export default QuantitySelector;
