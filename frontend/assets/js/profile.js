const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const avatarPreview = document.getElementById("avatarPreview");
const avatarUpload = document.getElementById("avatarUpload");

let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser || !loggedInUser.token) {
  window.location.href = "login.html";
}

async function fetchProfile() {
  try {
    const res = await fetch(`http://localhost:5000/api/profile`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${loggedInUser.token}`
      }
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    const data = await res.json();
    loggedInUser = { ...loggedInUser, ...data };
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    nameInput.value = data.name || "";
    emailInput.value = data.email || "";
    if (data.avatar) avatarPreview.src = data.avatar;
  } catch (err) {
    console.error("Error fetching profile:", err);
    alert("Failed to load profile. Please try again.");
  }
}
fetchProfile();
avatarUpload.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    avatarPreview.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

document.getElementById("profileForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const name = nameInput.value.trim();
  const password = passwordInput.value.trim();
  const avatar = avatarPreview.src;
  try {
    const res = await fetch(`http://localhost:5000/api/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${loggedInUser.token}`
      },
      body: JSON.stringify({ name, password, avatar })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update profile");
    alert("✅ Profile updated successfully!");

    loggedInUser = { ...loggedInUser, ...data };
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    passwordInput.value = ""; 
  } catch (err) {
    console.error("Error updating profile:", err);
    alert(err.message || "Something went wrong while updating profile.");
  }
});
