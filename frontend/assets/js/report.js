function getQueryAccount() {
  const params = new URLSearchParams(window.location.search);
  const acc = params.get("account");
  return acc ? acc.trim() : null;
}
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser || !loggedInUser.token) {
  window.location.href = "login.html";
}
const accountsContainer = document.getElementById("accountsContainer");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const netBalanceEl = document.getElementById("netBalance");
const totalRecordsEl = document.getElementById("totalRecords");
const filterCategory = document.getElementById("filterCategory");
const filterDate = document.getElementById("filterDate");
const applyFiltersBtn = document.getElementById("applyFilters");
const clearFiltersBtn = document.getElementById("clearFilters");
const resetReportBtn = document.getElementById("resetReport");

let allTransactions = [];
function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function fetchTransactions() {
  try {
    const res = await fetch("http://localhost:5000/api/transactions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`
      }
    });
    if (!res.ok) throw new Error("Failed to fetch transactions");
    const data = await res.json();
    return data.expenses || [];
  } catch (err) {
    console.error("fetchTransactions:", err);
    return [];
  }
}

async function deleteTransaction(id, row) {
  try {
    const res = await fetch(`http://localhost:5000/api/reports/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${loggedInUser.token}` }
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "Failed to delete");
    }
    row.remove();
    updateSummaryAfterDelete(id);
  } catch (err) {
    console.error("deleteTransaction:", err);
    alert(err.message || "Error deleting transaction");
  }
}

async function updateTransaction(id, data) {
  try {
    const res = await fetch(`http://localhost:5000/api/reports/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "Failed to update");
    }
  } catch (err) {
    console.error("updateTransaction:", err);
    alert(err.message || "Error updating transaction");
    throw err;
  }
}

function updateSummaryAfterDelete(id) {
  allTransactions = allTransactions.filter(t => t._id !== id);
  const grouped = groupByAccount(allTransactions);
  renderSummaryAndChart(allTransactions);
}

function groupByAccount(transactions) {
  const map = {};
  transactions.forEach(t => {
    const key = (t.name && t.name.trim()) ? t.name.trim() : "Self";
    if (!map[key]) map[key] = [];
    map[key].push(t);
  });
  return map;
}


function renderAccounts(grouped) {
  accountsContainer.innerHTML = "";
  Object.entries(grouped).forEach(([accountName, items]) => {
    let income = 0, expense = 0;
    items.forEach(i => {
      const amt = parseFloat(i.amount) || 0;
      if (i.type === "income") income += amt; else expense += amt;
    });
    const balance = income - expense;

    const card = document.createElement("div");
    card.className = "account-card";

    const header = document.createElement("div");
    header.className = "account-header";
    header.innerHTML = `
      <div class="account-left">
        <div class="account-name">${escapeHtml(accountName)}</div>
        <div class="account-stats">Income: ${income.toFixed(2)} · Expense: ${expense.toFixed(2)} · Balance: ${balance.toFixed(2)}</div>
      </div>
      <div>
        <button class="account-toggle">Show Transactions ▾</button>
      </div>
    `;
    card.appendChild(header);

    const txWrap = document.createElement("div");
    txWrap.className = "account-transactions";

    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>Type</th>
          <th>Title</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Date</th>
          <th>Notes</th>
          <th>Image</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(tx => {
          const amt = Number(tx.amount || 0).toFixed(2);
          const date = tx.date ? new Date(tx.date).toLocaleDateString() : "-";
          const notes = escapeHtml(tx.notes || "-");
          const type = escapeHtml(tx.type || "-");
          const title = escapeHtml(tx.title || "-");
          const category = escapeHtml(tx.category || "-");
          const currency = escapeHtml(tx.currency || "$");
          const imagesHtml = (tx.images && tx.images.length)
            ? tx.images.map(img => `<img src="${escapeHtml(img)}" class="tx-image">`).join("")
            : "-";
          return `
            <tr data-id="${tx._id}">
              <td data-label="Type">${type}</td>
              <td data-label="Title">${title}</td>
              <td data-label="Amount">${currency}${amt}</td>
              <td data-label="Category">${category}</td>
              <td data-label="Date">${date}</td>
              <td data-label="Notes">${notes}</td>
              <td data-label="Image">${imagesHtml}</td>
              <td data-label="Action">
                <button class="edit-btn" data-id="${tx._id}">Edit</button>
                <button class="delete-btn" data-id="${tx._id}">Delete</button>
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    `;
    txWrap.appendChild(table);
    card.appendChild(txWrap);

  
    const toggleBtn = header.querySelector(".account-toggle");
    toggleBtn.addEventListener("click", () => {
      const shown = txWrap.style.display === "block";
      txWrap.style.display = shown ? "none" : "block";
      toggleBtn.textContent = shown ? "Show Transactions ▾" : "Hide Transactions ▴";
      if (!shown) card.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    txWrap.addEventListener("click", async (ev) => {
      const row = ev.target.closest("tr");
      if (!row) return;
      if (!row.dataset.original) {
        const original = {};
        row.querySelectorAll("td[data-label]").forEach(td => {
          const label = td.getAttribute("data-label");
          original[label] = td.innerHTML;
        });
        row.dataset.original = JSON.stringify(original);
      }
      const editBtn = ev.target.closest(".edit-btn");
      if (editBtn) {
        row.querySelectorAll("td[data-label]").forEach(td => {
          const label = td.getAttribute("data-label");

          if (["Notes", "Date", "Title", "Amount", "Category"].includes(label)) {
            let val = td.textContent;
            if (label === "Amount") val = val.replace(/[^0-9.-]/g, ""); 
            const type = label === "Date" ? "date" : "text";
            td.innerHTML = `<input type="${type}" value="${val}" style="width:100%"/>`;
          }

        
          if (label === "Image") {
            const imgs = td.querySelectorAll("img");
            if (imgs.length) {
              td.innerHTML = "";
              imgs.forEach(img => {
                td.innerHTML += `<input type="text" value="${img.src}" style="width:100%; margin-bottom:2px;"/>`;
              });
            } else {
              td.innerHTML = `<input type="text" value="" style="width:100%"/>`;
            }
          }
        });

        const actionTd = row.querySelector('td[data-label="Action"]');
        actionTd.innerHTML = `
          <button class="save-btn" data-id="${row.dataset.id}">Save</button>
          <button class="cancel-btn" data-id="${row.dataset.id}">Cancel</button>
        `;
        return;
      }

    
      const saveBtn = ev.target.closest(".save-btn");
      if (saveBtn) {
        const id = saveBtn.dataset.id;
        const updated = {};

        row.querySelectorAll("td[data-label]").forEach(td => {
          const label = td.getAttribute("data-label");
          const inputEls = td.querySelectorAll("input");
          if (!inputEls.length) return;

          if (label === "Image") {
            const urls = Array.from(inputEls).map(i => i.value.trim()).filter(v => v);
            updated.images = urls;
          } else if (label === "Amount") {
            updated.amount = parseFloat(inputEls[0].value.trim()) || 0;
          } else if (label === "Date") {
            const val = inputEls[0].value.trim();
            if (val) updated.date = new Date(val).toISOString();
          } else if (label === "Title") {
            updated.title = inputEls[0].value.trim();
          } else if (label === "Category") {
            updated.category = inputEls[0].value.trim();
          } else if (label === "Notes") {
            updated.notes = inputEls[0].value.trim();
          }
        });

        console.log("Updating ID:", id, "with data:", updated);

        try {
          await updateTransaction(id, updated);

    
          Object.entries(updated).forEach(([key, val]) => {
            const td = row.querySelector(`td[data-label="${key.charAt(0).toUpperCase() + key.slice(1)}"]`);
            if (!td) return;
            if (key === "images") {
              td.innerHTML = val.length ? val.map(url => `<img src="${url}" class="tx-image">`).join("") : "-";
            } else if (key === "amount") {
              const currency = td.textContent[0] || "$";
              td.textContent = currency + Number(val).toFixed(2);
            } else if (key === "date") {
              td.textContent = new Date(val).toLocaleDateString();
            } else {
              td.textContent = val;
            }
          });
          const actionTd = row.querySelector('td[data-label="Action"]');
          actionTd.innerHTML = `
            <button class="edit-btn" data-id="${row.dataset.id}">Edit</button>
            <button class="delete-btn" data-id="${row.dataset.id}">Delete</button>
          `;
          delete row.dataset.original;
          renderSummaryAndChart(allTransactions);
        } catch (err) {
          console.error("Error saving:", err);
        }

        return;
      }
      const cancelBtn = ev.target.closest(".cancel-btn");
      if (cancelBtn) {
        if (row.dataset.original) {
          const original = JSON.parse(row.dataset.original);
          Object.entries(original).forEach(([label, html]) => {
            const td = row.querySelector(`td[data-label="${label}"]`);
            if (td) td.innerHTML = html;
          });
          delete row.dataset.original;
        }
        return;
      }
      const deleteBtn = ev.target.closest(".delete-btn");
      if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        console.log("Deleting ID:", id);
        if (confirm("Delete this transaction?")) {
          await deleteTransaction(id, row);
        }
      }
    });
    accountsContainer.appendChild(card);
  });
}
function renderSummaryAndChart(transactions) {
  let totalIncome = 0, totalExpense = 0;
  transactions.forEach(t => {
    const amt = parseFloat(t.amount) || 0;
    if (t.type === "income") totalIncome += amt; else totalExpense += amt;
  });
  totalIncomeEl.textContent = totalIncome.toFixed(2);
  totalExpenseEl.textContent = totalExpense.toFixed(2);
  netBalanceEl.textContent = (totalIncome - totalExpense).toFixed(2);
  totalRecordsEl.textContent = transactions.length;
  renderChart(transactions);
}
async function loadReport() {
  accountsContainer.innerHTML = "<p style='text-align:center;color:var(--muted)'>Loading...</p>";
  allTransactions = await fetchTransactions();
  let filtered = allTransactions.slice();
  const cat = filterCategory?.value;
  const dateVal = filterDate?.value;
  if (cat) filtered = filtered.filter(t => t.category === cat);
  if (dateVal) {
    const sel = new Date(dateVal).toLocaleDateString();
    filtered = filtered.filter(t => new Date(t.date).toLocaleDateString() === sel);
  }

  if (filtered.length === 0) {
    accountsContainer.innerHTML = `<div style="padding:1.2rem;background:#fff;border-radius:10px;text-align:center;">No transactions found.</div>`;
    renderSummaryAndChart([]);
    return;
  }
  const grouped = groupByAccount(filtered);
  renderAccounts(grouped);
  renderSummaryAndChart(filtered);
}
function renderChart(transactions) {
  const ctxEl = document.getElementById("monthlyChart");
  if (!ctxEl) return;
  const ctx = ctxEl.getContext("2d");
  const incomeData = Array(12).fill(0);
  const expenseData = Array(12).fill(0);
  transactions.forEach(t => {
    const d = t.date ? new Date(t.date) : new Date();
    const m = d.getMonth();
    const amt = parseFloat(t.amount) || 0;
    if (t.type === "income") incomeData[m] += amt; else expenseData[m] += amt;
  });
  if (window.reportChart) window.reportChart.destroy();
  window.reportChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      datasets: [
        { label: "Income", data: incomeData, borderColor: "#2b2d42", tension: 0.2, fill: false },
        { label: "Expense", data: expenseData, borderColor: "#ef233c", tension: 0.2, fill: false }
      ]
    },
    options: { responsive: true, plugins: { legend: { position: "top" } } }
  });
}
function clearFilters() {
  if (filterCategory) filterCategory.value = "";
  if (filterDate) filterDate.value = "";
  loadReport();
}
async function resetReport() {
  if (!confirm("This will delete ALL your transactions. Continue?")) return;
  try {
    const res = await fetch("http://localhost:5000/api/reports", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${loggedInUser.token}` }
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "Failed to reset");
    }
    await loadReport();
  } catch (err) {
    console.error("resetReport:", err);
    alert(err.message || "Error resetting report");
  }
}
document.addEventListener("DOMContentLoaded", () => {
  loadReport();
  applyFiltersBtn?.addEventListener("click", loadReport);
  clearFiltersBtn?.addEventListener("click", clearFilters);
  resetReportBtn?.addEventListener("click", resetReport);
});
