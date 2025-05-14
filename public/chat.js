<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Kontak</title>
  <link rel="stylesheet" href="css/main.css" />
</head>
<body>
  <h2>Kontak</h2>
  <input type="number" id="search-number" placeholder="Cari Nomor" />
  <button onclick="searchContact()">Cari</button>
  <div id="search-result"></div>

  <h3>Daftar Kontak</h3>
  <div id="contact-list">
    <!-- Kontak tersimpan akan muncul di sini -->
  </div>

  <script src="js/contact.js"></script>
</body>
</html>
