import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "gray", // hover state border color
    },
    "&.Mui-focused fieldset": {
      borderColor: "black", // focused state border color
    },
  },
  "& .MuiInputLabel-root": {
    color: "black", // label color
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "black", // label color when focused
  },
  "& .MuiOutlinedInput-input::placeholder": {
    color: "black", // placeholder color
    opacity: 0.5, // placeholder transparency
  },
}));

export default CustomTextField;
