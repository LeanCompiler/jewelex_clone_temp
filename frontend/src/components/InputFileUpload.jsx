import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const HiddenInput = styled("input")({
  display: "none",
});

const InputFileUpload = ({
  accept = "image/*,video/*,application/pdf",
  setItems,
  maxFiles = 10,
  maxFileSize = 5 * 1024 * 1024, // 5 MB
}) => {
  const onFileChange = (e) => {
    let files = Array.from(e.target.files);

    if (files.length > maxFiles) {
      alert(`You can upload a maximum of ${maxFiles} files.`);
      files = files.slice(0, maxFiles); // Trim excess files
      return;
    }

    const validFiles = files.filter((file) => file.size <= maxFileSize);
    if (validFiles.length !== files.length) {
      const invalidFiles = files.filter((file) => file.size > maxFileSize);
      alert(
        `Some files were too large (Max: ${
          maxFileSize / 1024 / 1024
        } MB). Invalid files: ${invalidFiles
          .map((file) => file.name)
          .join(", ")}`
      );
      return;
    }

    setItems(validFiles);
  };

  return (
    <Button
      variant="contained"
      component="label"
      startIcon={<CloudUploadIcon />}
      fullWidth
      sx={{
        height: 36,
        textTransform: "none",
        color: "#0066B4",
        background: "white",
        border: "1px solidrgb(224, 224, 224)",
      }}
    >
      <p className="button-text" style={{ color: "#0066B4" }}>
        Upload File
      </p>
      <HiddenInput
        type="file"
        accept={accept}
        onChange={onFileChange}
        multiple
      />
    </Button>
  );
};

export default InputFileUpload;
