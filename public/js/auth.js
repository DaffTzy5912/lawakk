function register() {
  const name = document.getElementById("name").value.trim();
  const number = document.getElementById("number").value.trim();
  const message = document.getElementById("message");

  if (!name || !number) return (message.textContent = "Isi semua data!");
  if (number.length > 6) return (message.textContent = "Nomor max 6 digit!");

  fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, number }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "home.html";
      } else {
        message.textContent = data.message;
      }
    })
    .catch(err => {
      message.textContent = "Gagal terhubung ke server.";
    });
}
