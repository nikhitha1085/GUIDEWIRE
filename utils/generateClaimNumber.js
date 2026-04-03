const generateClaimNumber = () => {
  const year = new Date().getFullYear();
  const random4Digits = Math.floor(1000 + Math.random() * 9000); // 4 digits
  return `CLM-${year}-${random4Digits}`;
};

module.exports = generateClaimNumber;
