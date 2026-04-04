const generatePolicyNumber = () => {
  const year = new Date().getFullYear();
  const random5Digits = Math.floor(10000 + Math.random() * 90000); // 5 digits
  return `PWK-${year}-${random5Digits}`;
};

module.exports = generatePolicyNumber;
