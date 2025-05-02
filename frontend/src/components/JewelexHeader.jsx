import React from "react";
import Grid from "@mui/material/Grid2";
import jewelexLogo from "../assets/jewelex-logo.png";

const JewelexHeader = () => {
  return (
    <Grid container size={12} justifyContent="center">
      <img
        src={jewelexLogo}
        alt="logo"
        style={{ height: 40, marginBottom: 20 }}
      />
    </Grid>
  );
};

export default JewelexHeader;
