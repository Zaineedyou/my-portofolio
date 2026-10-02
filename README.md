# Zaineedyou — Portfolio

Redesain visual dari portofolio ini, dibangun dengan **Vite + React +
TypeScript** (bukan Next.js, bukan single HTML). Semua teks, nama proyek,
deskripsi, dan tautan diambil apa adanya dari data sumber
(`src/data/resume.ts`) — hanya tampilan (warna, layout, tipografi,
animasi, dekorasi) yang didesain ulang dari nol.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Build produksi

```bash
npm run build
npm run preview
```

## Arah desain

- **Palet**: pink sakura, lavender, dan putih soft sebagai warna sekunder
  saja (tidak pernah jadi latar utama). Satu warna tinta ungu tua
  dipakai khusus untuk teks agar kontrasnya terjamin (≥ 4.5:1 di semua
  kombinasi latar).
- **Tipografi**: `Fraunces` (serif italic, untuk kesan mewah & lembut)
  dipadukan dengan `Quicksand` (sans membulat, untuk kesan cute &
  feminin) — via Google Fonts, ditautkan di `index.html`.
- **Layout**: hero dua kolom dengan bingkai foto berbentuk blob dan
  cincin dekoratif; ringkasan dalam kartu "atelier"; skill sebagai
  "gelang charm" bergantung pada seutas benang putus-putus; proyek
  disusun selang-seling ala lookbook editorial dengan bingkai media
  organik (bukan kartu kotak generik).
- **Motion**: satu urutan reveal saat halaman dimuat (hero), reveal
  halus saat scroll per section, dan drift kelopak sakura yang lambat —
  semua menghormati `prefers-reduced-motion`.
