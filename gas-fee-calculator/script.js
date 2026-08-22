const RPC_URL = "https://ethereum-rpc.publicnode.com";

const gasLimitInput = document.getElementById("gasLimit");
const gasPriceDisplay = document.getElementById("gasPriceDisplay");
const ethFee = document.getElementById("ethFee");
const gweiFee = document.getElementById("gweiFee");
const status = document.getElementById("status");
const refreshBtn = document.getElementById("refreshBtn");
const errorMessage = document.getElementById("errorMessage");

let currentGasPriceGwei = null;

function formatGwei(value) {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatEth(value) {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8
  });
}

function calculateFee() {
  const gasLimit = Number(gasLimitInput.value);

  if (
    currentGasPriceGwei === null ||
    !Number.isFinite(gasLimit) ||
    gasLimit < 0
  ) {
    ethFee.textContent = "--";
    gweiFee.textContent = "--";
    return;
  }

  const feeInGwei = gasLimit * currentGasPriceGwei;
  const feeInEth = feeInGwei / 1_000_000_000;

  ethFee.textContent = formatEth(feeInEth);
  gweiFee.textContent = `${feeInGwei.toLocaleString("en-US")} Gwei`;
}

async function fetchGasPrice() {
  refreshBtn.disabled = true;
  status.textContent = "Fetching live data...";
  errorMessage.hidden = true;

  try {
    const response = await fetch(RPC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_gasPrice",
        params: [],
        id: 1
      })
    });

    if (!response.ok) {
      throw new Error(`RPC request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || "Ethereum RPC returned an error.");
    }

    if (!data.result) {
      throw new Error("No gas price was returned.");
    }

    // eth_gasPrice returns Wei as a hexadecimal value.
    const gasPriceWei = BigInt(data.result);

    // 1 Gwei = 1,000,000,000 Wei.
    const gasPriceGwei =
      Number(gasPriceWei) / 1_000_000_000;

    if (!Number.isFinite(gasPriceGwei)) {
      throw new Error("Invalid gas price returned by the RPC endpoint.");
    }

    currentGasPriceGwei = gasPriceGwei;

    gasPriceDisplay.textContent = `${formatGwei(gasPriceGwei)} Gwei`;
    status.textContent = "🟢 Live gas price";
    calculateFee();
  } catch (error) {
    currentGasPriceGwei = null;
    gasPriceDisplay.textContent = "Unavailable";
    status.textContent = "Unable to fetch live data";
    ethFee.textContent = "--";
    gweiFee.textContent = "--";

    errorMessage.textContent =
      `Could not fetch the live gas price. ${error.message}`;
    errorMessage.hidden = false;
  } finally {
    refreshBtn.disabled = false;
  }
}

gasLimitInput.addEventListener("input", calculateFee);
refreshBtn.addEventListener("click", fetchGasPrice);

fetchGasPrice();
