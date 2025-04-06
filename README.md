# 🚀 ERC-20 Auto Deploy for TEA Sepolia

Script sederhana untuk **deploy token ERC-20 secara otomatis** di jaringan **TEA Sepolia** menggunakan Hardhat.

---

## ✨ Fitur

- Input interaktif: nama token, simbol, dan total supply
- Otomatis menggunakan konfigurasi dari `.env`
- Menampilkan hasil TX lengkap dengan explorer link
- Opsi untuk deploy ulang langsung dari terminal
- Animasi loading spinner (UX friendly)

---

## ⚙️ VPS Requirements

### 1. Ubuntu (disarankan Ubuntu 20.04 / 22.04)
### 2. RAM minimal 1GB
### 3. Install Node.js (minimal versi 18)

```bash
sudo apt update
sudo apt remove nodejs -y
sudo apt autoremove -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y
```

---

## 🧰 Cara Install & Setup

### 1. Clone Repository

```bash
git clone https://github.com/robynasuro/erc20-auto-deploy-tea.git
cd erc20-auto-deploy-tea
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup File `.env`

Buat file `.env` di folder root:

```env
RPC_URL=https://rpc-sepolia.tea.xyz
PRIVATE_KEY=0xyourprivatekey
```

> Jangan pernah share `PRIVATE_KEY` ke orang lain ya brok!

---

## 🧪 Jalankan Script

```bash
npx hardhat run scripts/deploy.js --network custom
```

Kamu akan diminta input:

- Nama token
- Simbol token
- Total supply

Output akan menampilkan:

```
✅ Token berhasil dideploy!
📦 Address: 0x...
🔗 Explorer: https://sepolia.tea.xyz/tx/0x...
```

Lalu akan muncul pertanyaan:

```
Deploy ulang? (y/n)
```

Ketik `y` jika ingin deploy token baru lagi.

---

## 🐛 Troubleshooting

### ❌ Error: Cannot find module 'readline-sync'

Install modul-nya:

```bash
npm install readline-sync
```

---

### ❌ Error: Network custom doesn't exist

Pastikan konfigurasi `hardhat.config.js` sudah benar.

---

### ❌ Error: Library @openzeppelin/contracts not installed

Install OpenZeppelin:

```bash
npm install @openzeppelin/contracts
```

---

## 🧼 Tips Keamanan

- Jangan pernah upload `.env` ke publik
- Selalu cek kembali input token sebelum deploy
- Gunakan wallet khusus untuk testing (jangan pakai wallet utama)

---

## 📎 Credits

Build with ❤️ for TEA Sepolia Network Community

---

Happy Deploying! 🚀
