import React, { useRef } from "react";
import {
  Autocomplete,
  TextField,
  createTheme,
  ThemeProvider,
  FormControl,
  InputLabel,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "black",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          "&:focus": {
            color: "black",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "black",
          "&.Mui-focused": {
            color: "black",
          },
        },
      },
    },
  },
});

const useStyles = makeStyles({
  select: {
    "& .MuiSelect-select:focus": {
      color: "black",
    },
  },
  formControl: {},
  inputLabel: {
    color: "black",
    "&.Mui-focused": {
      color: "black",
    },
  },
});

function SearchableSelect({ attribute, setAttribute, items, label }) {
  // Find the currently selected item based on the attribute value.
  const currentValue = items.find((item) => item.value === attribute) || null;
  const classes = useStyles();
  const selectRef = useRef(null);

  return (
    <ThemeProvider theme={theme}>
      <Autocomplete
        options={items}
        getOptionLabel={(option) => option.label}
        value={currentValue}
        onChange={(event, newValue) =>
          setAttribute(newValue ? newValue.value : "")
        }
        clearIcon={null}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            size="small"
            focused
          />
        )}
        fullWidth
      />
    </ThemeProvider>
  );
}

export default SearchableSelect;
