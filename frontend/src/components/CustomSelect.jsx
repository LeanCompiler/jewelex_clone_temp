import React, { useRef } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

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

function CustomSelect({ attribute, setAttribute, items, label }) {
  const classes = useStyles();
  const selectRef = useRef(null);

  return (
    <ThemeProvider theme={theme}>
      <FormControl focused fullWidth className={classes.formControl}>
        <InputLabel focused className={classes.inputLabel} htmlFor={attribute}>
          {label}
        </InputLabel>
        <Select
          name={attribute}
          label={label}
          value={attribute}
          onChange={(e) => setAttribute(e.target.value)}
          className={classes.select}
          inputRef={selectRef}
          inputProps={{
            id: attribute,
          }}
          size={"small"}
        >
          {items.map((item, index) => (
            <MenuItem key={index} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ThemeProvider>
  );
}

export default CustomSelect;
