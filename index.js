const hre = require("hardhat");
const readline = require("readline-sync");
const fs = require("fs");
const cron = require("node-cron");
require("dotenv").config();

function spinner(text, duration = 3000) {
  const frames = ['/', '-', '\\'];
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write(`\r${frames[i++ % frames.length]} ${text}`);
  }, 150);

  return new Promise((resolve) => {
    setTimeout(() => {
      clearInterval(interval);
      process.stdout.write('\r');
      resolve();
    }, duration);
  });
}

function generateUniqueName(existingNames) {
  const baseNames = ["Dragon", "Phoenix", "Griffin", "Hydra", "Titan", "Valkyrie", "Golem", "Leviathan", "Sphinx", "Chimera"];
  let name, attempts = 0;
  do {
    const base = baseNames[Math.floor(Math.random() * baseNames.length)];
    const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    name = `${base}${suffix}`;
    attempts++;
  } while (existingNames.includes(name) && attempts < 100);
  return name;
}

function getRandomSupply() {
  const min = 500_000_000;
  const max = 1_000_000_000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateEnvTokenAddress(newAddress) {
  const envPath = ".env";
  const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const lines = envContent.split("\n").filter(Boolean);

  const deployedLine = lines.find(line => line.startsWith("DEPLOYED_TOKEN_ADDRESSES="));
  let addresses = deployedLine ? JSON.parse(deployedLine.split("=")[1]) : [];

  if (!addresses.includes(newAddress)) {
    addresses.push(newAddress);
  }

  const newLines = lines.filter(line => !line.startsWith("DEPLOYED_TOKEN_ADDRESSES=") && !line.startsWith("LAST_DEPLOYED_TOKEN_ADDRESS="));
  newLines.push(`DEPLOYED_TOKEN_ADDRESSES=${JSON.stringify(addresses)}`);
  newLines.push(`LAST_DEPLOYED_TOKEN_ADDRESS=${newAddress}`);

  fs.writeFileSync(envPath, newLines.join("\n"));
}

async function deployTokenAuto(name, symbol, supply) {
  try {
    const [deployer] = await hre.ethers.getSigners();
    const supplyInWei = hre.ethers.parseUnits(supply.toString(), 18);
    const ContractFactory = await hre.ethers.getContractFactory("MinimalERC20");

    await spinner("Deploying");

    const token = await ContractFactory.deploy(name, symbol, supplyInWei);
    await token.waitForDeployment();

    const tokenAddress = await token.getAddress();
    const txHash = token.deploymentTransaction().hash;
    const explorerUrl = `https://sepolia.tea.xyz/tx/${txHash}`;

    const time = new Date().toLocaleTimeString("id-ID", { hour12: false, timeZone: "Asia/Jakarta" });
    console.log(`\n[${time}] [✓] Auto Token Deployed: ${name} (${symbol})`);
    console.log(`📦 Address: ${tokenAddress}`);
    console.log(`🔗 ${explorerUrl}\n`);

    updateEnvTokenAddress(tokenAddress);
    return true;
  } catch (err) {
    console.log(`❌ Deploy gagal, retry...`);
    return false;
  }
}

function scheduleAutoDeploy() {
  console.log("🔁 Auto Deploy aktif. Menunggu jadwal jam 10:00 WIB...\n");

  cron.schedule("0 3 * * *", async () => { // 10:00 WIB = 03:00 UTC
    console.clear();
    console.log(`\n🕙 Auto Deploy Harian (Max 3 Token)\n`);

    const deployed = [];
    const env = fs.existsSync(".env") ? fs.readFileSync(".env", "utf8") : "";
    const existingNames = (env.match(/"([^"]+)"/g) || []).map(n => n.replace(/"/g, ""));

    for (let i = 0; i < 3; i++) {
      let name = generateUniqueName(existingNames.concat(deployed));
      let symbol = name.slice(0, 4).toUpperCase();
      let supply = getRandomSupply();

      const success = await deployTokenAuto(name, symbol, supply);
      if (success) {
        deployed.push(name);
      } else {
        i--; // retry
      }
    }
  });
}

async function deployManual() {
  console.clear();
  console.log(`\n🚀 Deploy Manual ERC-20\n`);

  const name = readline.question("Nama token: ");
  const symbol = readline.question("Simbol token: ");
  const totalSupply = readline.question("Total supply (dalam satuan token): ");

  const [deployer] = await hre.ethers.getSigners();
  const supplyInWei = hre.ethers.parseUnits(totalSupply, 18);
  const ContractFactory = await hre.ethers.getContractFactory("MinimalERC20");

  await spinner("Deploying");

  const token = await ContractFactory.deploy(name, symbol, supplyInWei);
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  const txHash = token.deploymentTransaction().hash;
  const explorerUrl = `https://sepolia.tea.xyz/tx/${txHash}`;

  console.log(`\n[✓] Token berhasil dideploy!`);
  console.log(`📦 Address: ${tokenAddress}`);
  console.log(`🔗 Explorer: ${explorerUrl}\n`);

  updateEnvTokenAddress(tokenAddress);

  const answer = readline.question("Deploy lagi (y) / Menu (m) / Keluar (n)? ");
  if (answer.toLowerCase() === "y") {
    await deployManual();
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
  console.log(`💰 Saldo TEA: ${nativeInTEA} TEA\n`);

  const tokens = JSON.parse(process.env.DEPLOYED_TOKEN_ADDRESSES || "[]");
  if (tokens.length === 0) {
    console.log("⚠️ Belum ada token yang dideploy.\n");
  } else {
    const factory = await hre.ethers.getContractFactory("MinimalERC20");
    for (let tokenAddress of tokens) {
      try {
        const token = await factory.attach(tokenAddress);
        const balance = await token.balanceOf(address);
        const symbol = await token.symbol();
        const formatted = hre.ethers.formatUnits(balance, 18);
        const isLast = process.env.LAST_DEPLOYED_TOKEN_ADDRESS === tokenAddress;
        console.log(`🪙 ${symbol}: ${formatted} ${symbol} ${isLast ? "(latest)" : ""}`);
        console.log(`   📦 ${tokenAddress}`);
      } catch {
        console.log(`⚠️ Gagal membaca token ${tokenAddress}`);
      }
    }
  }

  readline.question("\nTekan Enter untuk kembali ke menu...");
  await mainMenu();
}

async function mainMenu() {
  console.clear();
  console.log("🧩 Auto Deploy ERC-20 - Menu Utama");
  console.log("1. Semi Auto Deploy (Manual Input)");
  console.log("2. Auto Deploy Tiap Jam 10 Pagi WIB");
  console.log("3. Cek Saldo Wallet");
  console.log("4. Keluar");

  const choice = readline.question("\nPilih menu (1/2/3/4): ");
  if (choice === "1") {
    await deployManual();
  } else if (choice === "2") {
    scheduleAutoDeploy();
    while (true) {
      await spinner("/ Menunggu auto deploy harian");
    }
  } else if (choice === "3") {
    await checkWallet();
  } else {
    console.log("\n👋 Bye!\n");
    process.exit(0);
  }
}

mainMenu();
