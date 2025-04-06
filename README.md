# ERC-20 Auto Deploy TEA

Proyek ini memungkinkan Anda untuk melakukan **deploy token ERC-20** ke jaringan **TEA Sepolia** secara otomatis setiap hari pukul **10 pagi WIB**, serta menyediakan opsi deploy manual (semi auto), pengecekan saldo wallet, dan sistem log yang lengkap.

---

## 🚀 Fitur Utama

- **Auto Deploy Harian:** Deploy hingga 3 token berbeda secara otomatis tiap hari (jam 10 WIB).
- **Semi Auto Deploy:** Deploy token ERC-20 dengan input manual (nama, simbol, total supply).
- **Auto Generate Nama Token:** Nama token dihasilkan otomatis & unik tanpa angka.
- **Cek Saldo Wallet:** Menampilkan saldo TEA + semua token ERC-20 yang pernah di-deploy.
- **Log Lengkap:** Mencatat waktu, nama token, supply, TX hash dan contract address.
- **Animasi Stylish:** Indikator loading dan spinner modern.

---

## 📦 Instalasi

```bash
git clone https://github.com/robynasuro/erc20-auto-deploy-tea.git
cd erc20-auto-deploy-tea
npm install
```

> Jika `git pull` error karena local changes, jalankan:
```bash
git stash
git pull
```

---

## ⚙️ Setup `.env`

Buat file `.env` di root project, lalu isi seperti berikut:

```
PRIVATE_KEY=your_private_key
RPC_URL=https://rpc-sepolia.tea.xyz
DEPLOYED_TOKEN_ADDRESSES=[]
```

> Jangan ubah format array untuk `DEPLOYED_TOKEN_ADDRESSES`. Biarkan kosong jika belum pernah deploy.

---

## 🛠️ Cara Menjalankan

### 1. Manual / Semi Auto Deploy

```bash
node index.js
```

Pilih menu `Semi Auto Deploy` → input token → otomatis deploy.

### 2. Auto Deploy (Setiap Hari Jam 10 WIB)

Jalankan script dengan mode terus aktif (misalnya di VPS pakai `screen`):
```bash
node index.js
```

> Pilih menu `Auto Deploy Harian`, lalu biarkan aktif.

---

## 🧪 Auto Setup (opsional)

🚀 Ultimate Auto Setup (Sekali Paste Langsung Jalan)

```bash
git clone https://github.com/robynasuro/erc20-auto-deploy-tea.git && cd erc20-auto-deploy-tea && echo -e "PRIVATE_KEY=0xyourprivatekey\nRPC_URL=https://rpc.sepolia.tea.xyz\nDEPLOYED_TOKEN_ADDRESSES=[]" > .env && npm install && npx hardhat compile && node index.js
```

### 🧾 Catatan:

- Ganti `0xyourprivatekey` sama **private key wallet** lu sebelum enter ya brok!
- `.env` langsung ke-generate otomatis berkat `echo`, jadi lu **gak perlu bikin manual lagi**.
- Setelah jalan, tinggal **pilih menu** dan nikmati fitur **auto-deploy harian kaya Sultan 😎**


---

## 🧾 Troubleshooting

### ❌ Error `Cannot find module 'node-cron'`
> Solusi: Pastikan sudah jalankan `npm install`.

### ❌ Error `git pull` gagal karena local changes
> Solusi:
```bash
git stash
git pull
```

### ❌ Auto deploy tidak jalan
> Pastikan VPS/server tetap online dan zona waktu sesuai (`WIB` = UTC+7).

---

## 🤝 Kontribusi

Feel free untuk forking repo ini atau request fitur baru 😄.

---

## 📄 Lisensi

MIT © 2025 robynasuro
