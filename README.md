# AI2Z QR Studio

Aplikasi web responsif untuk menjana kod QR daripada pautan HTTP(S) atau teks. Pilih warna kod dan latar, lihat pratonton dan muat turun imej PNG.

## Cara menjalankan

1. Simpan semua fail dalam folder yang sama.
2. Buka `index.html` dalam Chrome, Firefox atau pelayar moden lain. Sambungan internet diperlukan untuk memuatkan pustaka QR daripada jsDelivr.
3. Pilih **Pautan** atau **Teks** dan masukkan kandungan. Contoh pautan ialah `https://example.com`.
4. Pilih warna dan tekan **Muat turun PNG**. **Tetapkan semula** mengosongkan input serta mengembalikan warna dan jenis kandungan asal.

Untuk menjalankan melalui pelayan tempatan, buka terminal dalam folder projek, jalankan `python3 -m http.server 8000`, kemudian buka http://localhost:8000.

## Teknologi

HTML5, CSS3, JavaScript vanilla dan `qrcode-generator@1.4.4` melalui jsDelivr. Kod QR dijana dalam pelayar menggunakan pembetulan ralat M dan zon kosong empat modul. Kandungan input diproses dalam pelayar.
