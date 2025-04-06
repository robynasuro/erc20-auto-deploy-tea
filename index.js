const hre = require("hardhat");
const readline = require("readline-sync");
const fs = require("fs");
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

  console.log(`\n✅ Token berhasil dideploy!`);
  console.log(`📦 Contract Address: ${tokenAddress}`);
  console.log(`🔗 Explorer: ${explorerUrl}\n`);

  // Simpan ke .env otomatis
  const envPath = ".env";
  const envLines = fs.readFileSync(envPath, "utf8").split("\n");
  const updatedLines = envLines.map(line =>
    line.startsWith("LAST_DEPLOYED_TOKEN=") ? `LAST_DEPLOYED_TOKEN=${tokenAddress}` : line
  );
  if (!updatedLines.find(line => line.startsWith("LAST_DEPLOYED_TOKEN="))) {
    updatedLines.push(`LAST_DEPLOYED_TOKEN=${tokenAddress}`);
  }
  fs.writeFileSync(envPath, updatedLines.join("\n"));
  console.log(`📁 Address token disimpan otomatis ke .env\n`);

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

  try {
    const tokenAddress = process.env.LAST_DEPLOYED_TOKEN;
    const tokenFactory = await hre.ethers.getContractFactory("MinimalERC20");
    const token = await tokenFactory.attach(tokenAddress);
    const tokenBalance = await token.balanceOf(address);
    const symbol = await token.symbol();
    const tokenInUnits = hre.ethers.formatUnits(tokenBalance, 18);

    console.log(`🪙 Saldo Token (${symbol}): ${tokenInUnits} ${symbol}`);
    console.log(`📦 Token Address: ${tokenAddress}`);
  } catch {
    console.log(`⚠️ Gagal membaca token ${process.env.LAST_DEPLOYED_TOKEN || "(tidak ditemukan)"}`);
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
