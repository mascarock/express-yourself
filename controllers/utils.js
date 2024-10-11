// Utility function to validate if hex is exactly 32 characters
const isValidHex32 = (hexString) => /^[0-9a-fA-F]{32}$/.test(hexString);

module.exports = {
  isValidHex32,
};
