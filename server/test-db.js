const { Client } = require("pg"); // Pastikan Anda telah menginstal pg: npm install pg

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "loopback_user",
  password: "root",
  database: "team_management",
});

client
  .connect()
  .then(() => {
    console.log("Koneksi berhasil");
    client.end();
  })
  .catch((err) => {
    console.error("Koneksi gagal:", err.message);
  });
