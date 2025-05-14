const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location.href = "index.html";

document.getElementById("name").value = user.name;
document.getElementById("bio").value = user.bio || "";
document.getElementById("profile-photo").src = user.photo || "default.jpg";

function saveProfile() {
  const name = document.getElementById("name").value.trim();
  const bio = document.getElementById("bio").value.trim();
  const file = document.getElementById("photo").files[0];

  const reader = new FileReader();
  reader.onload = () => {
    fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number: user.number,
        name,
        bio,
        photo: reader.result,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.user));
          alert("Profil diperbarui!");
        }
      });
  };

  if (file) reader.readAsDataURL(file);
  else reader.onload();
}
