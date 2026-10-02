function loadComponent(id, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;

      if (file.includes("header.html")) {
        const menuBtn = document.getElementById("menuToggle");
        const navbar = document.getElementById("navbar");
        if (menuBtn && navbar) {
          menuBtn.addEventListener("click", () => {
            navbar.classList.toggle("show");
          });
        }
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
          logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            window.location.href = "login.html";
          });
        }
      }
    })
    .catch(err => console.error("Component load error:", err));
}

window.addEventListener("DOMContentLoaded", () => {
  // Check if page requires login
  if (document.body.dataset.requiresAuth === "true") {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      window.location.href = "login.html";
      return;
    }
  }
  const headerEl = document.getElementById("header");
  const footerEl = document.getElementById("footer");
  if (headerEl) loadComponent("header", "components/header.html");
  if (footerEl) loadComponent("footer", "components/footer.html");
});
