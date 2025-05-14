let socket;
const user = JSON.parse(localStorage.getItem("user"));
const chatWith = JSON.parse(localStorage.getItem("chatWith"));

if (!user || !chatWith) window.location.href = "index.html";

document.getElementById("chat-with").textContent = chatWith.name;

function goBack() {
  window.location.href = "home.html";
}

function sendMessage() {
  const message = document.getElementById("message").value;
  const image = document.getElementById("imageInput").files[0];

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
      socket.emit("chat", data);
    };
    reader.readAsDataURL(image);
  } else {
    socket.emit("chat", data);
  }

  document.getElementById("message").value = "";
  document.getElementById("imageInput").value = "";
}

function displayMessage(msg, isSent) {
  const div = document.createElement("div");
  div.className = "message " + (isSent ? "sent" : "received");
  div.innerHTML = msg.text || "";
  if (msg.image) {
    const img = document.createElement("img");
    img.src = msg.image;
    img.style.maxWidth = "200px";
    div.appendChild(img);
  }
  document.getElementById("chat-box").appendChild(div);
}

socket = io();
socket.emit("join", user.number);

socket.on("message", msg => {
  if (msg.from === chatWith.number || msg.to === chatWith.number) {
    const isSent = msg.from === user.number;
    displayMessage(msg, isSent);
  }
});
