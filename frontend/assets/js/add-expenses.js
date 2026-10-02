const EXPENSE_API = "http://localhost:5000/api/transactions";
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}

let uploadedImages = [];
const transactionUploadInput = document.getElementById("transactionImages");
const transactionGallery = document.getElementById("transactionGallery");
if (transactionUploadInput && transactionGallery) {
  transactionUploadInput.addEventListener("change", (e) => {
    const files = e.target.files;
    if (!files.length) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = function (event) {
        uploadedImages.push(event.target.result);
        const imgEl = document.createElement("img");
        imgEl.src = event.target.result;
        imgEl.style.width = "100px";
        imgEl.style.height = "100px";
        imgEl.style.objectFit = "cover";
        imgEl.style.margin = "5px";
        imgEl.style.borderRadius = "8px";
        transactionGallery.appendChild(imgEl);
      };
      reader.readAsDataURL(file);
    });
  });
}

async function loadExpenses() {
  const loggedInUser = getLoggedInUser();
  if (!loggedInUser) return;
  try {
    const res = await fetch(EXPENSE_API, {
      headers: {
        "Authorization": `Bearer ${loggedInUser.token}`
      }
    });
    const data = await res.json();
    if (res.ok) {
      renderExpenses(data.expenses);
    } else {
      alert(data.message || "Failed to load expenses.");
    }
  } catch (err) {
    console.error("Error loading expenses:", err);
    alert("Something went wrong while loading expenses.");
  }
}
function renderExpenses(expenses = []) {
  const list = document.getElementById("expensesList");
  if (!list) return;
  list.innerHTML = "";
  if (expenses.length === 0) {
    list.innerHTML = "<p>No expenses yet. Add one!</p>";
    return;
  }
  expenses.forEach(exp => {
    const item = document.createElement("div");
    item.classList.add("expense-item");
    let imagesHTML = "";
    if (exp.images && exp.images.length) {
      imagesHTML = `<div class="expense-images">
                      ${exp.images.map(img => `<img src="${img}" style="width:50px;height:50px;object-fit:cover;margin:2px;border-radius:4px;">`).join('')}
                    </div>`;
    }

    item.innerHTML = `
      <p>
        <strong>${exp.title}</strong> 
        - ${exp.type === 'income' ? '💰' : '💸'} ${exp.amount} 
        (${exp.type})
      </p>
      <small>${new Date(exp.date).toLocaleDateString()}</small>
      ${imagesHTML}
      <button onclick="deleteExpense('${exp._id}')">Delete</button>
    `;
    list.appendChild(item);
  });
}
async function addExpense(event) {
  event.preventDefault(); 
  const loggedInUser = getLoggedInUser();
  if (!loggedInUser) {
    alert("You must be logged in.");
    return;
  }
  const transactionData = {
    type: document.getElementById("transactionType").value,
    title: document.getElementById("title").value.trim(),
    amount: parseFloat(document.getElementById("amount").value),
    date: document.getElementById("date").value,
    category: document.getElementById("category").value|| "other",
    notes: document.getElementById("notes").value || "",
    name: document.getElementById("expenseName").value || "",
    currency: document.getElementById("currency").value || "INR",
    images: uploadedImages 
  };
  if (!transactionData.title || !transactionData.amount || !transactionData.date) {
    alert("Please fill all required fields.");
    return;
  }
  try {
    const res = await fetch(EXPENSE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`
      },
      body: JSON.stringify(transactionData)
    });
    const data = await res.json();
    if (res.ok) {
      alert("Transaction added successfully!");
      document.getElementById("expenseForm").reset();
      if (transactionGallery) transactionGallery.innerHTML = "";
      uploadedImages = [];
      loadExpenses();
    } else {
      alert(data.message || "Failed to add transaction.");
    }
  } catch (err) {
    console.error("Error adding transaction:", err);
    alert("Something went wrong while adding transaction.");
  }
}
async function deleteExpense(expenseId) {
  const loggedInUser = getLoggedInUser();
  if (!loggedInUser) return;
  try {
    const res = await fetch(`${EXPENSE_API}/${expenseId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${loggedInUser.token}`
      }
    });
    const data = await res.json();
    if (res.ok) {
      alert("Expense deleted!");
      loadExpenses();
    } else {
      alert(data.message || "Failed to delete expense.");
    }
  } catch (err) {
    console.error("Delete expense error:", err);
    alert("Something went wrong while deleting expense.");
  }
}
const expenseForm = document.getElementById("expenseForm");
if (expenseForm) {
  expenseForm.addEventListener("submit", addExpense);
}
document.addEventListener("DOMContentLoaded", () => {
  loadExpenses();
  const urlParams = new URLSearchParams(window.location.search);
  const accountName = urlParams.get("name"); 
  const expenseNameInput = document.getElementById("expenseName");
  if (accountName && expenseNameInput) {
    expenseNameInput.value = accountName;   
  }
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }
  const currencyInput = document.getElementById("currency");
  if (currencyInput && !currencyInput.value) {
    currencyInput.value = "INR";
  }
});
