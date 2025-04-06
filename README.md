# 💥 Auto ERC-20 Token Deployer for TEA Sepolia

A simple Hardhat-based script to auto deploy custom ERC-20 tokens on TEA Sepolia network.

---

## ✨ Fitur

- Input nama token, simbol, dan total supply via CLI  
- Animasi loading spinner saat proses deploy  
- Link explorer langsung muncul setelah deploy  
- Bisa deploy ulang tanpa restart script  
- Auto konek ke wallet dari `.env`

---

## ⚙️ Requirement VPS

### 1. Install Node.js (Minimal Versi 18)

Jika muncul error seperti:

```
SyntaxError: Unexpected token '('
```

Berarti Node.js versi kamu terlalu jadul. Jalankan ini:

```bash
sudo apt remove nodejs -y
sudo apt autoremove -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y
```

### 2. Install Dependensi

```bash
npm install
```

Jika ada error seperti `readline-sync` not found:

```bash
npm install readline-sync dotenv @openzeppelin/contracts
```

---

## 📁 Struktur File Penting

```
auto-deploy-erc20/
├── contracts/
│   └── MinimalERC20.sol
├── scripts/
│   └── deploy.js
├── .env
├── hardhat.config.js
└── README.md
```

---

## ⚙️ Setup File

### .env

Buat file `.env` di root project:

```env
PRIVATE_KEY=0xyourprivatekey
RPC_URL=https://sepolia.tea.xyz
```

> PRIVATE_KEY jangan pernah dikasih ke orang lain brok ⚠️

---

## 🚀 Menjalankan Script

### 1. Jalankan deploy.js

```bash
npx hardhat run scripts/deploy.js --network custom
```

Script akan minta input:
- Nama token (contoh: BULAKTEA)
- Simbol token (contoh: BLKTEA)
- Total supply (contoh: 6969696969)

Contoh output:

```
✅ Token berhasil dideploy!
📦 Address: 0x300e29...
🔗 Explorer: https://sepolia.tea.xyz/tx/0x781f64...
```

Akan muncul juga pertanyaan:

```
Deploy ulang? (y/n):
```

Kalau jawab `y`, script akan langsung ulang dari awal.

---

## 🔧 Troubleshooting

### HH100: Network custom doesn't exist

Pastikan di `hardhat.config.js` sudah ada:

```js
require("dotenv").config();

module.exports = {
  solidity: "0.8.24",
  networks: {
    custom: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

---

### HH411: @openzeppelin/contracts not installed

```bash
npm install @openzeppelin/contracts
```

---

### Module 'readline-sync' not found

```bash
npm install readline-sync
```

---

## 👨‍💻 Tips Tambahan

- Jalankan script via `screen` di VPS agar tetap jalan walau terminal ditutup:

```bash
screen -S deploy
npx hardhat run scripts/deploy.js --network custom
```

- Keluar dari screen: `Ctrl+A`, lalu `D`  
- Balik lagi ke screen: `screen -r deploy`

---

## 📦 MinimalERC20.sol

File kontrak minimal sudah tersedia di folder `contracts/MinimalERC20.sol` dan otomatis terhubung ke script deploy.

---

## 🚀 Happy Deploying!

Build your token empire on TEA Sepolia 🍵💸
