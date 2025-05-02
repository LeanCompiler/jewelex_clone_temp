import React from "react";
import Grid from "@mui/material/Grid2";
import { createTheme, styled, useMediaQuery, useTheme } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import backgroundImg from "../assets/white-diamond-bg.jpg";
import Navbar from "../components/Navbar";

const Wrapper = styled(Grid)`
  /*  div {
    border: 1px solid red;
  }
  border: 1px solid red; */

  background-image: url(${backgroundImg});
  background-size: 70px 70px;
  background-repeat: repeat;
  background-position: center;

  min-height: 100vh;

  .navbarContainer {
    position: sticky;
    top: 0;
    // max-height: 60px;
    width: 100vw;
    z-index: 100;
  }
`;

const MainLayout = ({ children }) => {
  const renderedScreen = useLocation().pathname;

  const theme = useTheme();
  const customTheme = createTheme({
    breakpoints: {
      values: {
        tablet: 900,
        breakpoint1: 1300,
        breakpoint2: 600,
        ...theme.breakpoints.values,
      },
    },
  });

  const isTablet = useMediaQuery(customTheme.breakpoints.down("tablet"));
  const isBreakpoint1 = useMediaQuery(
    customTheme.breakpoints.down("breakpoint1")
  );
  const isBreakpoint2 = useMediaQuery(
    customTheme.breakpoints.down("breakpoint2")
  );

  return (
    <Wrapper
      container
      size={12}
      justifyContent={"center"}
      alignContent={"flex-start"}
    >
      <Grid
        container
        size={12}
        className="navbarContainer"
        // style={{
        //   // marginBottom: !isTablet ? 15 : 0,
        //   minHeight: !isTablet ? 70 : 2,
        // }}
      >
        <Navbar />
      </Grid>

      <Outlet>{children}</Outlet>
    </Wrapper>
  );
};

export default MainLayout;
