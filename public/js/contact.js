const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location.href = "index.html";

function searchContact() {
  const number = document.getElementById("search-number").value.trim();
  if (!number) return;

  fetch(`/api/user/${number}`)
    .then(res => res.json())
    .then(data => {
      const resultDiv = document.getElementById("search-result");
      if (!data.success) return (resultDiv.textContent = "Tidak ditemukan");
      resultDiv.innerHTML = `
        <strong>${data.user.name}</strong><br/>
        ${data.user.bio || ""}
        <button onclick="saveContact('${number}', '${data.user.name}')">Simpan</button>
      `;
    });
}

function saveContact(number, name) {
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  contacts.push({ number, name });
  localStorage.setItem("contacts", JSON.stringify(contacts));
  loadContacts();
}

function loadContacts() {
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  const list = document.getElementById("contact-list");
  list.innerHTML = "";
  contacts.forEach(c => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${c.name}</strong> (${c.number})`;
    div.onclick = () => {
      localStorage.setItem("chatWith", JSON.stringify(c));
      window.location.href = "chat.html";
    };
    list.appendChild(div);
  });
}

loadContacts();
