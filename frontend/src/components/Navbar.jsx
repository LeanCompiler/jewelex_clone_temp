import React, { useState, useRef } from "react";
import Grid from "@mui/material/Grid2";
import { styled, Popover, Box, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import jewelexLogo from "../assets/jewelex-logo.png";
import { useNavigate } from "react-router-dom";
import useGlobalData from "../hooks/useGlobalData";

const Wrapper = styled(Grid)`
  // div {
  //   border: 1px solid red;
  // }
  // border: 1px solid red;

  height: 60px;
  @media (max-width: 768px) {
    height: 50px;
  }

  padding: 10px 60px;
  @media (max-width: 768px) {
    padding: 10px 20px;
  }
  @media (max-width: 400px) {
    padding: 6px 12px;
  }

  background-color: rgba(255, 255, 255, 1);
  .navItem {
    cursor: pointer;
    padding: 8px 16px;
    @media (max-width: 768px) {
      padding: 4px 8px;
    }
    border-radius: 4px;
    transition: background-color 0.3s ease;
    p {
      font-size: 16px;
      @media (max-width: 768px) {
        font-size: 14px;
      }
      letter-spacing: 1px;
      font-weight: 500;
      color: #333;
      transition: color 0.3s ease;
    }
  }
  .navItem:hover {
    background-color: rgba(24, 163, 236, 0.1);
    p {
      color: #18a3ec;
    }

    .arrowIcon {
      color: #18a3ec;
    }
  }
  .logoContainer {
    .logoImg {
      height: 34px;
      @media (max-width: 600px) {
        height: 24px;
      }
    }
  }
`;

const StyledPopover = styled(Popover)`
  .MuiPaper-root {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }
`;

const SubItemWrapper = styled(Box)`
  min-width: 180px;
  padding: 8px 0;
`;

const SubItem = styled(Typography)`
  padding: 10px 20px;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
  text-decoration: none;
  &:hover {
    color: #18a3ec;
    padding-left: 24px;
  }
`;

const SubItemContainer = styled(Grid)`
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    background-color: rgba(24, 163, 236, 0.1);
  }
`;

const Navbar = () => {
  const navItems = [
    {
      title: "Order",
      subItems: [
        { title: "Order by details", href: "/form" },
        { title: "Order by media", href: "/form/media" },
      ],
    },
    {
      title: "Summary",
      subItems: [
        { title: "Summary by details", href: "/summary" },
        { title: "Summary by media", href: "/summary/media" },
      ],
    },
  ];

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeNavIndex, setActiveNavIndex] = useState(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (event, index) => {
    clearTimeout(timeoutRef.current);
    setAnchorEl(event.currentTarget);
    setActiveNavIndex(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setAnchorEl(null);
      setActiveNavIndex(null);
    }, 100);
  };

  const handlePopoverMouseEnter = () => {
    clearTimeout(timeoutRef.current);
  };

  const handlePopoverMouseLeave = () => {
    setAnchorEl(null);
    setActiveNavIndex(null);
  };

  // For parent nav items: if subItems exist, toggle the popover;
  // otherwise, navigate directly.
  const handleClickNavigate = (event, item, index = null) => {
    if (item?.subItems) {
      if (index === activeNavIndex) {
        setAnchorEl(null);
        setActiveNavIndex(null);
      } else {
        setAnchorEl(event.currentTarget);
        setActiveNavIndex(index);
      }
      return;
    }
    // No subItems: navigate directly.
    const href = item.href;
    const url = new URL(window.location.href);
    const userId = url.searchParams.get("user_id") || "";
    navigate(userId ? `${href}?user_id=${userId}` : href);
  };

  // Handle subitem click to navigate and close the popover.
  const handleSubItemClick = (subItem) => {
    const href = subItem.href;
    const url = new URL(window.location.href);
    const userId = url.searchParams.get("user_id") || "";
    navigate(userId ? `${href}?user_id=${userId}` : href);
    setAnchorEl(null);
    setActiveNavIndex(null);
  };

  return (
    <Wrapper
      container
      size={12}
      justifyContent={"space-between"}
      alignContent={"center"}
      alignItems={"center"}
    >
      <Grid
        container
        size={2}
        justifyContent={"flex-start"}
        alignContent={"center"}
        className="logoContainer"
      >
        <img src={jewelexLogo} alt="Jewelex Logo" className="logoImg" />
      </Grid>
    </Wrapper>
  );
};

export default Navbar;
