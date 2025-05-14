let socket;
const user = JSON.parse(localStorage.getItem("user"));
const chatWith = JSON.parse(localStorage.getItem("chatWith"));

if (!user || !chatWith) window.location.href = "index.html";

document.getElementById("chat-with").textContent = chatWith.name;

// Inisialisasi socket
socket = io(); // Gunakan io("http://localhost:3000") jika beda origin

socket.on("connect", () => {
  console.log("Terhubung ke server");
  socket.emit("join", user.number);
});

socket.on("connect_error", err => {
  console.error("Gagal konek:", err.message);
});

socket.on("message", msg => {
  if (msg.from === chatWith.number || msg.to === chatWith.number) {
    const isSent = msg.from === user.number;
    displayMessage(msg, isSent);
  }
});

function goBack() {
  window.location.href = "home.html";
}

function sendMessage() {
  const message = document.getElementById("message").value.trim();
  const image = document.getElementById("imageInput").files[0];

  if (!message && !image) return;

  const data = {
    from: user.number,
    to: chatWith.number,
    text: message,
    image: null,
  };

  if (image) {
    const reader = new FileReader();
    reader.onload = () => {
      data.image = reader.result;
      console.log("Kirim (img):", data);
      socket.emit("chat", data);
      displayMessage(data, true);
    };
    reader.readAsDataURL(image);
  } else {
    console.log("Kirim:", data);
    socket.emit("chat", data);
    displayMessage(data, true);
  }

  document.getElementById("message").value = "";
  document.getElementById("imageInput").value = "";
}

function displayMessage(msg, isSent) {
  const div = document.createElement("div");
  div.className = "message " + (isSent ? "sent" : "received");

  if (msg.text) {
    const p = document.createElement("p");
    p.textContent = msg.text;
    div.appendChild(p);
  }

  if (msg.image) {
    const img = document.createElement("img");
    img.src = msg.image;
    img.style.maxWidth = "200px";
    div.appendChild(img);
  }

  document.getElementById("chat-box").appendChild(div);
  document.getElementById("chat-box").scrollTop = document.getElementById("chat-box").scrollHeight;
}
