const API_URL = "http://localhost:5000/api/auth";
async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    console.log("Login response:", res.status, data);
    if (!res.ok) {
      alert(data.message || "Invalid email or password.");
      return;
    }
    if (!data.user || !data.user.token) {
      console.error("No token found in response:", data);
      alert("Login failed. Please try again.");
      return;
    }
    localStorage.setItem("loggedInUser", JSON.stringify(data.user));
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong. Please try again later.");
  }
}
async function saveUser(user) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    console.log("Register response:", res.status, data);
    if (!res.ok) {
      alert(data.message || "User already exists or invalid input.");
      return false;
    }
    alert("✅ Account created successfully! Please login.");
    window.location.href = "login.html";
    return true;
  } catch (err) {
    console.error("Registration error:", err);
    alert("Something went wrong. Please try again later.");
    return false;
  }
}
async function resetPassword(email, newPassword) {
  const msgEl = document.getElementById("resetMessage");
  if (msgEl) { msgEl.textContent = ""; msgEl.style.color = ""; }
  if (!email || !newPassword) {
    if (msgEl) showMessage(msgEl, "Please provide email and new password.", "error");
    return false;
  }
  if (newPassword.length < 5) {
    if (msgEl) showMessage(msgEl, "Password must be at least 5 characters.", "error");
    return false;
  }
  try {
    console.log("Requesting password reset for:", email);
    const res = await fetch(`${API_URL}/reset-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword })
    });
    let data;
    try {
      data = await res.json();
    } catch (parseErr) {
      console.warn("Reset: failed to parse JSON response", parseErr);
      data = {};
    }
    console.log("Reset response:", res.status, data);

    if (!res.ok) {
      const errMsg = data.message || `Reset failed (status ${res.status})`;
      if (msgEl) showMessage(msgEl, errMsg, "error");
      return false;
    }

    if (msgEl) showMessage(msgEl, data.message || "Password reset successful. Please login.", "success");
    return true;
  } catch (err) {
    console.error("Reset password fetch error:", err);
    if (msgEl) showMessage(msgEl, "Network error. Try again later.", "error");
    return false;
  }
}
function showMessage(el, message, type = "error") {
  if (!el) return;
  el.textContent = message;
  el.style.color = type === "error" ? "red" : "green";
}
document.addEventListener("DOMContentLoaded", () => {
  const showResetBtn = document.getElementById("showResetBtn");
  const resetSection = document.getElementById("resetSection");
  if (showResetBtn && resetSection) {
    showResetBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (resetSection.style.display === "none" || resetSection.style.display === "") {
        resetSection.style.display = "block";
        showResetBtn.textContent = "Hide Reset Password";
      } else {
        resetSection.style.display = "none";
        showResetBtn.textContent = "Forgot Password?";
      }
    });
  }
});
function logoutUser() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    if (!name.match(/^[A-Za-z\s]+$/)) {
      alert("Name should contain only letters.");
      return;
    }
    if (password.length < 5) {
      alert("Password must be at least 5 characters long.");
      return;
    }
    await saveUser({ name, email, password });
  });
}
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    await loginUser(email, password);
  });
}

const resetForm = document.getElementById("resetForm");
if (resetForm) {
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("resetEmail").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();

    if (newPassword.length < 5) {
      alert("Password must be at least 5 characters long.");
      return;
    }
    const success = await resetPassword(email, newPassword);
    if (success) {
      resetForm.reset();
      const resetSection = document.getElementById("resetSection");
      if (resetSection) resetSection.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = getLoggedInUser();
  const page = window.location.pathname.split("/").pop();

  const protectedPages = [
    "dashboard.html",
    "add-expenses.html",
    "reports.html",
    "profile.html",
  ];

  if (protectedPages.includes(page)) {
    if (!loggedInUser || !loggedInUser.token) {
      window.location.href = "login.html";
      return;
    }

    const userNameElem = document.getElementById("userName");
    if (userNameElem)
      userNameElem.innerText = loggedInUser.name || loggedInUser.email || "";
  }
});
