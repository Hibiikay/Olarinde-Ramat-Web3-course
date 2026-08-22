const gasLimitInput = document.getElementById("gasLimit");
const gasPriceInput = document.getElementById("gasPrice");
const ethFee = document.getElementById("ethFee");
const gweiFee = document.getElementById("gweiFee");
const resetBtn = document.getElementById("resetBtn");

function formatNumber(value, decimals = 8) {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function calculateFee() {
  const gasLimit = Number(gasLimitInput.value);
  const gasPrice = Number(gasPriceInput.value);

  if (!Number.isFinite(gasLimit) || !Number.isFinite(gasPrice) ||
      gasLimit < 0 || gasPrice < 0) {
    ethFee.textContent = "0.00000000";
    gweiFee.textContent = "0";
    return;
  }

  // Gas price is entered in Gwei.
  // 1 ETH = 1,000,000,000 Gwei.
  const feeInGwei = gasLimit * gasPrice;
  const feeInEth = feeInGwei / 1_000_000_000;

  ethFee.textContent = formatNumber(feeInEth, 8);
  gweiFee.textContent = feeInGwei.toLocaleString("en-US", {
    maximumFractionDigits: 2
  });
}

gasLimitInput.addEventListener("input", calculateFee);
gasPriceInput.addEventListener("input", calculateFee);

resetBtn.addEventListener("click", () => {
  gasLimitInput.value = 21000;
  gasPriceInput.value = 20;
  calculateFee();
});

calculateFee();
