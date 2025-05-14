const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" }
});
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const PORT = process.env.PORT || 3000;
const DB_FILE = "./database.json";

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.post("/api/register", (req, res) => {
  const { name, number } = req.body;
  const db = readDB();

  if (!name || !number) return res.json({ success: false, message: "Isi lengkap!" });
  if (number.length > 6) return res.json({ success: false, message: "Nomor max 6 digit" });
  if (db.users.find(u => u.number === number)) {
    return res.json({ success: false, message: "Nomor sudah terdaftar" });
  }

  const user = { name, number, bio: "", photo: "", online: true };
  db.users.push(user);
  writeDB(db);

  return res.json({ success: true, user });
});

app.get("/api/user/:number", (req, res) => {
  const { number } = req.params;
  const db = readDB();
  const user = db.users.find(u => u.number === number);
  if (!user) return res.json({ success: false });
  res.json({ success: true, user });
});

app.post("/api/profile", (req, res) => {
  const { number, name, bio, photo } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.number === number);
  if (!user) return res.json({ success: false });

  user.name = name;
  user.bio = bio;
  user.photo = photo;
  writeDB(db);

  res.json({ success: true, user });
});

app.get("/api/chats/:number", (req, res) => {
  const { number } = req.params;
  const db = readDB();
  const chats = db.messages
    .filter(msg => msg.from === number || msg.to === number)
    .reduce((acc, msg) => {
      const other = msg.from === number ? msg.to : msg.from;
      const contact = db.users.find(u => u.number === other);
      if (!acc[other] || acc[other].time < msg.time) {
        acc[other] = {
          number: other,
          name: contact?.name || "Tidak dikenal",
          lastMessage: msg.text || "[Foto]",
          time: msg.time,
        };
      }
      return acc;
    }, {});
  res.json(Object.values(chats));
});

io.on("connection", socket => {
  console.log("Pengguna terhubung:", socket.id);

  socket.on("join", number => {
    console.log("Join ke:", number);
    socket.join(number);
    const db = readDB();
    const user = db.users.find(u => u.number === number);
    if (user) {
      user.online = true;
      writeDB(db);
    }
  });

  socket.on("chat", msg => {
    console.log("Pesan diterima:", msg);
    msg.time = Date.now();
    const db = readDB();
    db.messages.push(msg);
    writeDB(db);
    io.to(msg.to).emit("message", msg);
    io.to(msg.from).emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Pengguna terputus:", socket.id);
  });
});

http.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
