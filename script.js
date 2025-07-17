let customers = JSON.parse(localStorage.getItem("customers")) || [];

function saveCustomers() {
  localStorage.setItem("customers", JSON.stringify(customers));
}

document.addEventListener("DOMContentLoaded", () => {
  const name = document.getElementById("name");
  const pin = document.getElementById("pin");
  const amount = document.getElementById("amount");
  const submitBtn = document.getElementById("submitBtn");
  const outbox = document.getElementById("outbox");

  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const cname = name.value.trim();
      const cpin = pin.value.trim();
      const camount = parseFloat(amount.value.trim());

      if (cname && cpin.length === 4 && !isNaN(camount) && camount > 0) {
        customers.push({
          name: cname,
          pin: cpin,
          balance: camount,
          transactions: [],
        });
        saveCustomers();

        outbox.className = "alert alert-success mt-3";
        outbox.textContent = "Customer added successfully!";
        outbox.classList.remove("d-none");
        document.getElementById("nextBtn").disabled = false;
        name.value = pin.value = amount.value = "";
      } else {
        outbox.className = "alert alert-danger mt-3";
        outbox.textContent = "Please enter valid inputs!";
        outbox.classList.remove("d-none");
      }
    });
  }

  if (document.getElementById("customerDetails")) {
    renderCustomers();
  }
});

function renderCustomers() {
  const detailContainer = document.getElementById("customerDetails");
  const actionContainer = document.getElementById("customerActions");

  detailContainer.innerHTML = "";
  actionContainer.innerHTML = "";

  customers.forEach((cust, index) => {
    const detailCard = document.createElement("div");
    detailCard.className = "customer-card";
    detailCard.innerHTML = `
      <h5>${cust.name}</h5>
      <p>PIN: ${cust.pin}</p>
      <p>Initial Balance: ₹${cust.balance}</p>
    `;
    detailContainer.appendChild(detailCard);

    const actionCard = document.createElement("div");
    actionCard.className = "action-card";
    actionCard.innerHTML = `
      <h5>${cust.name}</h5>
      <input type="number" placeholder="Withdraw amount" class="withdraw-input" id="withdraw-${index}">
      <div class="action-buttons">
        <button class="btn btn-primary" onclick="withdrawAmount(${index})">Withdraw</button>
        <button class="btn btn-primary" onclick="showBalance(${index})">Balance</button>
      </div>
      <p id="balance-${index}" class="balance-text mt-2"></p>
    `;
    actionContainer.appendChild(actionCard);
  });
}

function withdrawAmount(index) {
  const input = document.getElementById(`withdraw-${index}`);
  const amount = parseFloat(input.value);
  if (!isNaN(amount) && amount > 0 && amount <= customers[index].balance) {
    customers[index].balance -= amount;
    customers[index].transactions.push({
      type: "Withdraw",
      amount,
      date: new Date().toLocaleString(),
    });
    saveCustomers();
    renderCustomers();
  } else {
    alert("Invalid or insufficient amount");
  }
}

function showBalance(index) {
  const balanceText = document.getElementById(`balance-${index}`);
  balanceText.textContent = `Balance: ₹${customers[index].balance}`;
}
