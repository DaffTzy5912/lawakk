document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return (window.location.href = "index.html");

  fetch(`/api/chats/${user.number}`)
    .then(res => res.json())
    .then(data => {
      const chatList = document.getElementById("chat-list");
      data.forEach(chat => {
        const div = document.createElement("div");
        div.className = "chat-item";
        div.innerHTML = `<strong>${chat.name}</strong><br/>${chat.lastMessage}`;
        div.onclick = () => {
          localStorage.setItem("chatWith", JSON.stringify(chat));
          window.location.href = "chat.html";
        };
        chatList.appendChild(div);
      });
    });
});
