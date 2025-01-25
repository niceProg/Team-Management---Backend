# Backend API - LoopBack 3

Backend API ini dibangun menggunakan **LoopBack 3** dan berjalan di atas **Node.js versi 14.21.3**. Aplikasi ini menyediakan fitur untuk mengelola tim dan anggota, memastikan anggota hanya dapat ditambahkan ke tim yang valid.

---

## 📋 Fitur Utama

- **Manajemen Tim**: CRUD operasi untuk tim.
- **Manajemen Anggota**: CRUD operasi untuk anggota, dengan validasi `tim_id` yang terkait.
- **Relasi Tim dan Anggota**:
  - Satu tim dapat memiliki banyak anggota.
  - Anggota harus memiliki `tim_id` yang valid.
- **API berbasis RESTful** dengan dokumentasi bawaan LoopBack.

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: [LoopBack 3](https://loopback.io/doc/en/lb3/)
- **Node.js**: 14.21.3
- **Database**: PostgreSQL 15.10

---

## 🖥️ Persyaratan Sistem

Pastikan Anda memiliki persyaratan berikut sebelum menjalankan aplikasi:

- **Node.js**: Versi 14.21.3
- **npm**: Versi 6.x atau lebih baru
- **PostgreSQL Server**: Versi 15.10
- **psql CLI**: Untuk mengelola database

---

## 🚀 Cara Instalasi dan Menjalankan Aplikasi

1. **Clone Repositori**

   ```bash
   git clone <repository-url>
   cd <repository-folder>

   ```

2. **Instal Dependensi**
   Jalankan perintah berikut untuk menginstal semua dependensi:

   ```bash
   npm install

   ```

3. **Konfigurasi Database**

   - Pastikan PostgreSQL sudah berjalan.
   - Buat database untuk aplikasi menggunakan perintah berikut:

   ```sql
   CREATE DATABASE nama_database;
   ```

   - Konfigurasi database di file server/datasources.json:

     ```json
     {
       "postgres": {
         "name": "postgres",
         "connector": "postgresql",
         "host": "localhost",
         "port": 5432,
         "database": "nama_database",
         "user": "username",
         "password": "password"
       }
     }
     ```

4. **Migrasi Model ke Database**

   - Pastikan database telah dikonfigurasi dengan benar.
   - Jalankan aplikasi untuk memastikan model diterapkan ke database:

   ```bash
   node server/server.js

   ```

5. **Jalankan Server**

   - Mulai server dengan perintah:

   ```bash
   npm start

   - Secara default, server akan berjalan di http://localhost:3000.
   ```

6. **Akses Dokumentasi API**

   - LoopBack menyediakan dokumentasi interaktif untuk API di http://localhost:3000/explorer.

## 📚 Dokumentasi API

### Tim

- GET /api/tim: Mendapatkan daftar semua tim.
- POST /api/tim: Membuat tim baru.
- GET /api/tim/{id}: Mendapatkan detail tim berdasarkan id.
- PUT /api/tim/{id}: Memperbarui data tim berdasarkan id.
- DELETE /api/tim/{id}: Menghapus tim berdasarkan id.

### Anggota

- GET /api/anggota: Mendapatkan daftar semua anggota.
- POST /api/anggota: Membuat anggota baru.
- GET /api/anggota/{id}: Mendapatkan detail anggota berdasarkan id.
- PUT /api/anggota/{id}: Memperbarui data anggota berdasarkan id.
- DELETE /api/anggota/{id}: Menghapus anggota berdasarkan id.

### ⚙️ Validasi dan Relasi

Validasi tim_id

- Sebelum menyimpan data anggota, sistem akan memeriksa apakah tim_id yang diberikan valid.
- Jika tim_id tidak valid, API akan mengembalikan respons error 400 dengan pesan:
  Invalid tim_id: Tim does not exist

Relasi Model

- Tim memiliki relasi hasMany dengan model Anggota.
- Anggota memiliki relasi belongsTo dengan model Tim.
