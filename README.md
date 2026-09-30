# KUKUSAN Admin — APK Builder (GitHub Actions)

Repo ni bina APK Android KUKUSAN Admin secara automatik guna GitHub Actions +
Capacitor — ikut pattern yang sama macam ProSudoku. APK ni cuma "bungkusan"
(wrapper); kandungan sebenar app dimuat terus dari
**https://kukusanmy.web.app/Admin.html** setiap kali dibuka (server.url dalam
`capacitor.config.json`) — so lepas ni bila awak `firebase deploy` macam
biasa, semua orang yang dah pasang APK ni terus dapat update, **tak payah
rebuild APK langsung**, kecuali kalau tukar ikon/nama app/splash screen.

## Cara guna

1. Cipta repo baru di GitHub: **alemmaxx/KUKUSAN** (public atau private,
   dua-dua boleh — private pun dapat 2000 minit Actions percuma sebulan).
2. Push semua fail dalam folder ni ke repo tu (`git init`, `git add .`,
   `git commit -m "setup"`, `git remote add origin ...`, `git push`).
3. Pergi tab **Actions** di repo — pastikan Actions enabled (biasanya
   automatik). Push ke branch `main` akan terus trigger build; boleh juga
   klik **Run workflow** (workflow_dispatch) untuk trigger manual.
4. Lepas build siap (~5-8 minit), APK boleh didownload di:
   - Tab **Actions** → klik run terkini → bahagian **Artifacts** →
     `KUKUSAN-Admin-APK`, ATAU
   - Tab **Releases** (workflow auto-cipta release baru setiap kali build,
     contoh `v1.0.3`).

## PENTING — Signing key (supaya update tak perlu uninstall)

APK sedia ada yang customer dah pasang (dibina guna PWABuilder) guna package
name **`app.web.kukusanmy.twa`** — fail `capacitor.config.json` dalam repo ni
sengaja guna package name **sama**, supaya APK baru dari sini boleh jadi
"update" terus kat app lama, bukan app berasingan.

Tapi Android hanya benarkan update in-place kalau **signing certificate
sama**. Kalau secret `KEYSTORE_BASE64` tak diisi, workflow akan guna kunci
random setiap build — customer yang dah pasang app lama TERPAKSA uninstall
dulu baru boleh pasang yang baru ni.

Ada 2 pilihan:

- **Nak update in-place (Recommended kalau dah ada customer guna app
  sedia ada):** cari fail keystore asal yang PWABuilder/uber-apk-signer guna
  masa signing APK yang sedia ada tu (biasanya `.jks` atau `.keystore`),
  convert ke base64 (`certutil -encode nama.jks base64.txt` kat Windows, atau
  `base64 -i nama.jks -o base64.txt` kat Mac/Linux), copy kandungan tu, pergi
  **Settings → Secrets and variables → Actions → New repository secret**,
  nama `KEYSTORE_BASE64`, paste value tu.
- **Tak kisah customer uninstall dulu / nak APK "fresh":** biarkan je secret
  tu kosong, workflow akan bagitahu amaran je dalam log (`::warning::`), APK
  tetap terhasil, cuma next build lain kunci pulak (so setiap build kena
  uninstall app lama dulu — kurang sesuai untuk production jangka panjang).

## Struktur fail

| Fail | Fungsi |
|---|---|
| `capacitor.config.json` | Config utama — `server.url` tentukan app load dari mana |
| `package.json` | Dependencies Capacitor |
| `.github/workflows/build-apk.yml` | Workflow bina + sign + release APK automatik |
| `index.html` | Splash sekejap semasa app connect (bukan app sebenar) |
| `offline.html` | Papar bila tiada internet |
| `manifest.webmanifest`, `sw.js`, `icons/` | Metadata + ikon app, cache splash/offline je |
| `assets/` | Sumber ikon/splash untuk `capacitor-assets generate` (auto-jana ikon Android) |

## Nak tukar ikon/nama app lain hari

Ganti `assets/icon.png` (1024×1024), `assets/splash.png` &
`assets/splash-dark.png` (2732×2732), atau fail-fail dalam `icons/`, push
balik — build seterusnya guna ikon baru automatik.
