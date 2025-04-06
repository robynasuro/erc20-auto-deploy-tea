const hre = require("hardhat");
const readline = require("readline-sync");
require("dotenv").config();

function spinner(text, duration = 3000) {
  const frames = ['|', '/', '-', '\\'];
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write(`\r${text} ${frames[i++ % frames.length]} `);
  }, 150);

  return new Promise((resolve) => {
    setTimeout(() => {
      clearInterval(interval);
      process.stdout.write('\r');
      resolve();
    }, duration);
  });
}

async function main() {
  console.log(`\n🚀 Auto Deploy ERC-20 (Minimal)\n`);

  const name = readline.question("Nama token: ");
  const symbol = readline.question("Simbol token: ");
  const totalSupply = readline.question("Total supply (dalam satuan token): ");

  const [deployer] = await hre.ethers.getSigners();

  const supplyInWei = hre.ethers.utils.parseUnits(totalSupply, 18);

  const ContractFactory = await hre.ethers.getContractFactory("MinimalERC20");

  await spinner("⏳ Deploying");

  const token = await ContractFactory.deploy(name, symbol, supplyInWei);
  await token.deployed();

  const txHash = token.deployTransaction.hash;
  const explorerUrl = `https://sepolia.tea.xyz/tx/${txHash}`;

  console.log(`\n✅ Token berhasil dideploy!`);
  console.log(`📦 Address: ${token.address}`);
  console.log(`🔗 Explorer: ${explorerUrl}\n`);

  const answer = readline.question("Deploy ulang? (y/n): ");
  if (answer.toLowerCase() === "y") {
    console.clear();
    main();
  } else {
    process.exit(0);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
