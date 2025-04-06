const hre = require("hardhat");
const readline = require("readline-sync");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

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

async function deployToken() {
  console.clear();
  console.log(`\n🚀 Auto Deploy ERC-20 (Minimal)\n`);

  const name = readline.question("Nama token: ");
  const symbol = readline.question("Simbol token: ");
  const totalSupply = readline.question("Total supply (dalam satuan token): ");

  const [deployer] = await hre.ethers.getSigners();
  const supplyInWei = hre.ethers.parseUnits(totalSupply, 18);
  const ContractFactory = await hre.ethers.getContractFactory("MinimalERC20");

  await spinner("⏳ Deploying");

  const token = await ContractFactory.deploy(name, symbol, supplyInWei);
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  const txHash = token.deploymentTransaction().hash;
  const explorerUrl = `https://sepolia.tea.xyz/tx/${txHash}`;

  // ✅ Simpan contract ke .env (replace jika sudah ada)
  const envPath = path.resolve(__dirname, ".env");
  let envContent = fs.readFileSync(envPath, "utf8");
  if (envContent.includes("LAST_DEPLOYED_TOKEN=")) {
    envContent = envContent.replace(/LAST_DEPLOYED_TOKEN=.*/g, `LAST_DEPLOYED_TOKEN=${tokenAddress}`);
  } else {
    envContent += `\nLAST_DEPLOYED_TOKEN=${tokenAddress}\n`;
  }
  fs.writeFileSync(envPath, envContent);

  console.log(`\n✅ Token berhasil dideploy!`);
  console.log(`📦 Contract Address: ${tokenAddress}`);
  console.log(`🔗 TX Hash: ${txHash}`);
  console.log(`🔗 Explorer: ${explorerUrl}\n`);

  const answer = readline.question("Deploy lagi (y) / Kembali ke menu (m) / Keluar (n)? ");
  if (answer.toLowerCase() === "y") {
    await deployToken();
  } else if (answer.toLowerCase() === "m") {
    await mainMenu();
  } else {
    console.log("\n👋 Bye!\n");
    process.exit(0);
  }
}

async function checkWallet() {
  console.clear();
  console.log(`\n👛 Cek Saldo Wallet\n`);

  const provider = hre.ethers.provider;
  const [signer] = await hre.ethers.getSigners();
  const address = await signer.getAddress();

  const nativeBalance = await provider.getBalance(address);
  const nativeInTEA = hre.ethers.formatEther(nativeBalance);

  console.log(`📮 Address: ${address}`);
  console.log(`💰 Saldo TEA: ${nativeInTEA} TEA`);

  const tokenAddress = process.env.LAST_DEPLOYED_TOKEN;
  if (tokenAddress) {
    try {
      const abi = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function balanceOf(address) view returns (uint256)"
      ];
      const token = new hre.ethers.Contract(tokenAddress, abi, signer);
      const symbol = await token.symbol();
      const balance = await token.balanceOf(address);

      console.log(`🪙 Token Terakhir (${symbol})`);
      console.log(`📦 Contract Address: ${tokenAddress}`);
      console.log(`💰 Saldo: ${hre.ethers.formatUnits(balance, 18)} ${symbol}`);
    } catch (err) {
      console.log(`⚠️ Gagal membaca token ${tokenAddress}`);
    }
  } else {
    console.log("ℹ️ Belum ada token yang dideploy.");
  }

  readline.question("\nTekan Enter untuk kembali ke menu utama...");
  await mainMenu();
}

async function mainMenu() {
  console.clear();
  console.log("🧩 Auto Deploy ERC-20 - Menu Utama");
  console.log("1. Deploy ERC-20 Token");
  console.log("2. Cek Wallet");
  console.log("3. Keluar");

  const choice = readline.question("\nPilih menu (1/2/3): ");
  if (choice === "1") {
    await deployToken();
  } else if (choice === "2") {
    await checkWallet();
  } else {
    console.log("\n👋 Bye!\n");
    process.exit(0);
  }
}

mainMenu();
