import { Button, styled } from "@mui/material";

const StyledButton = styled(Button)({
  color: "#0066B4",
  backgroundColor: "#0066B4",
  border: "2px solid #18A3EC29",
  boxShadow: "0 2px 3px rgba(0, 0, 0, 0.3)",
  transition: "transform 0.1s, box-shadow 0.2s",
  "&:hover": {
    backgroundColor: "#00ACE6",
    color: "white",
    transform: "translateY(-0.2px)",
    boxShadow: "0 3px 7px rgba(0, 0, 0, 0.4)",
  },
});

export default StyledButton;
