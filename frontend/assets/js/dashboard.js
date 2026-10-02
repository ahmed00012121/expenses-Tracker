const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser || !loggedInUser.token) {
  window.location.href = "login.html";
}
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const netBalanceEl = document.getElementById("netBalance");
const accountsTableBody = document.getElementById("accountsTableBody");

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function fetchDashboardData() {
  try {
    const res = await fetch("http://localhost:5000/api/dashboard", {
      headers: { Authorization: `Bearer ${loggedInUser.token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch dashboard data");
    return await res.json();
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    return null;
  }
}

async function renderDashboard() {
  const data = await fetchDashboardData();
  if (!data) {
    accountsTableBody.innerHTML = `<tr><td colspan="5">Error loading dashboard.</td></tr>`;
    return;
  }

  totalIncomeEl.textContent = `${data.totalIncome.toFixed(2)}`;
  totalExpenseEl.textContent = `${data.totalExpense.toFixed(2)}`;
  netBalanceEl.textContent = `${data.netBalance.toFixed(2)}`;
  accountsTableBody.innerHTML = "";
  if (!data.accounts || data.accounts.length === 0) {
    accountsTableBody.innerHTML = `<tr><td colspan="5">No accounts found.</td></tr>`;
    return;
  }
  data.accounts.forEach((acc) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(acc.name)}</td>
      <td>${acc.totalIncome.toFixed(2)}</td>
      <td>${acc.totalExpense.toFixed(2)}</td>
      <td>${acc.balance.toFixed(2)}</td>
      <td>
        <button class="btn add-expense-btn" data-name="${escapeHtml(acc.name)}">+ Add</button>
        <button class="btn report-btn" data-name="${escapeHtml(acc.name)}">more</button>
      </td>
    `;
    row.querySelector(".add-expense-btn").addEventListener("click", () => {
      const accName = row.querySelector(".add-expense-btn").getAttribute("data-name");
      window.location.href = `add-expenses.html?name=${encodeURIComponent(accName)}`;
    });
    row.querySelector(".report-btn").addEventListener("click", () => {
      const accName = row.querySelector(".report-btn").getAttribute("data-name");
      window.location.href = `report.html?account=${encodeURIComponent(accName)}`;
    });
    accountsTableBody.appendChild(row);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  renderDashboard();
  const userNameEl = document.getElementById("userName");
  if (userNameEl && loggedInUser?.name) userNameEl.textContent = loggedInUser.name;
  const addExpenseBtn = document.getElementById("addExpenseBtn");
  if (addExpenseBtn) {
    addExpenseBtn.addEventListener("click", () => {
      window.location.href = "add-expenses.html"; 
    });
  }
});
