require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  defaultNetwork: "tea",
  networks: {
    tea: {
      url: "https://rpc.sepolia.tea.xyz",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: "0.8.20",
};
