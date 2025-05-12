const getFileExtension = (fileName) => {
  const dotIndex = fileName.lastIndexOf(".");

  if (dotIndex === -1 || dotIndex === 0 || dotIndex === fileName.length - 1) {
    return false;
  }

  return fileName.substring(dotIndex + 1).toLowerCase();
};

export default getFileExtension;
