require("dotenv").config();
const { RPC_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.24",
  networks: {
    tea_sepolia: {
      url: RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};