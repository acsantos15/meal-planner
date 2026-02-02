// ===== GLOBAL DATA =====
let people = [];
let meals = [];
let additionalDebts = []; // { item, amount, boughtBy, requestedBy }

// Open/close modal
function openDebtModal() {
    document.getElementById("debtModal").classList.remove("hidden");
    if (additionalDebts.length === 0) addDebtRow(); // add first row by default
}

function closeDebtModal() {
    document.getElementById("debtModal").classList.add("hidden");
}

// Add a new debt row
function addDebtRow() {
    const debtRows = document.getElementById("debtRows");

    const rowIndex = debtRows.children.length;
    const row = document.createElement("div");
    row.className = "flex gap-2 items-center";

    // Item name
    const itemInput = document.createElement("input");
    itemInput.type = "text";
    itemInput.placeholder = "Item Name";
    itemInput.className = "border px-2 py-1 rounded w-2/5";

    // Amount
    const amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.placeholder = "Amount";
    amountInput.className = "border px-2 py-1 rounded w-1/5";

    // Bought by
    const boughtBySelect = document.createElement("select");
    boughtBySelect.className = "border px-2 py-1 rounded w-1/5";
    people.forEach((p, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.text = p.name;
        boughtBySelect.appendChild(opt);
    });

    // Requested by
    const requestedBySelect = document.createElement("select");
    requestedBySelect.className = "border px-2 py-1 rounded w-1/5";
    people.forEach((p, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.text = p.name;
        requestedBySelect.appendChild(opt);
    });

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.className = "bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600";
    delBtn.onclick = () => debtRows.removeChild(row);

    row.append(itemInput, amountInput, boughtBySelect, requestedBySelect, delBtn);
    debtRows.appendChild(row);
}

// Add a debt row to the meal table
function addDebtRowToTable(debt) {
    const table = document.getElementById("mealTable");
    const row = table.insertRow(-1);

    row.insertCell(0).innerText = "-"; // Day
    row.insertCell(1).innerText = debt.item; // Item name
    row.insertCell(2).innerText = "Additional Debt"; // Notes / Ingredients
    row.insertCell(3).innerText = debt.amount.toFixed(2); // Total Price
    row.insertCell(4).innerText = debt.amount.toFixed(2); // Per Person (for simplicity)
    row.insertCell(5).innerText = `${debt.requestedBy} → ${debt.boughtBy}`; // Breakdown
    const actionCell = row.insertCell(6);
    actionCell.innerHTML = `<button class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>`;

    // Delete functionality
    actionCell.querySelector("button").onclick = () => {
        additionalDebts = additionalDebts.filter(d => d !== debt);
        table.deleteRow(row.rowIndex);
    };
}

function updateDebtSummaryRow() {
    const table = document.getElementById("mealTable");

    // Remove old debt row
    const oldRow = Array.from(table.rows).find(r => r.dataset.type === "debtSummary");
    if (oldRow) table.deleteRow(oldRow.rowIndex);

    if (additionalDebts.length === 0) return;

    const row = table.insertRow(-1);
    row.dataset.type = "debtSummary";

    row.insertCell(0).innerText = "-";
    row.insertCell(1).innerText = "Additional Debts";
    row.insertCell(2).innerHTML = additionalDebts.map(d => `${d.item} (${d.requestedBy}→${d.boughtBy}): ${d.amount.toFixed(2)}`).join(", ");
    const totalDebt = additionalDebts.reduce((sum, d) => sum + d.amount, 0);
    row.insertCell(3).innerText = totalDebt.toFixed(2);
    row.insertCell(4).innerText = totalDebt.toFixed(2);
    row.insertCell(5).innerText = "Breakdown";
    const actionCell = row.insertCell(6);
    actionCell.innerHTML = `<button class="bg-red-500 text-white px-3 py-1 rounded">Delete All Debts</button>`;
    actionCell.querySelector("button").onclick = () => {
        additionalDebts = [];
        updateDebtSummaryRow();
    };
}


// Save debts
function saveDebts() {
    additionalDebts = [];
    const rows = document.getElementById("debtRows").children;
    for (let row of rows) {
        const inputs = row.querySelectorAll("input, select");
        const item = inputs[0].value.trim();
        const amount = Number(inputs[1].value) || 0;
        const boughtBy = people[Number(inputs[2].value)].name;
        const requestedBy = people[Number(inputs[3].value)].name;

        if (item && amount > 0) {
            additionalDebts.push({ item, amount, boughtBy, requestedBy });
        }
    }
    closeDebtModal();

    // <-- Add this
    updateDebtSummaryRow();
}



// ===== PEOPLE =====
const defaultNames = ["Allysa", "AC", "Renz", "Ariel", "Harish"];

function setPeople() {
    const count = Number(document.getElementById("personCount").value);
    const div = document.getElementById("peopleInputs");
    div.innerHTML = "";
    people = [];

    for (let i = 0; i < count; i++) {
        const name = defaultNames[i] || "Person " + (i + 1);
        people.push({ name });

        // Container for input + delete button
        const container = document.createElement("div");
        container.className = "flex items-center mb-2";

        // Input
        const input = document.createElement("input");
        input.type = "text";
        input.value = name;
        input.className = "border border-primary px-2 py-1 rounded-l w-full";
        input.addEventListener("input", function() {
            people[i].name = this.value;
            updatePeople();
            loadWhoWillEat();
            loadPayerInputs();
        });

        // Delete button
        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️";
        delBtn.addEventListener("click", () => {
            people.splice(i, 1); // remove from array
            setPeopleFromArray(); // re-render inputs
        });

        container.appendChild(input);
        container.appendChild(delBtn);

        div.appendChild(container);
    }

    updatePeople();
    loadWhoWillEat();
    loadPayerInputs();
}

// Helper to re-render people array (after delete)
function setPeopleFromArray() {
    const div = document.getElementById("peopleInputs");
    div.innerHTML = "";
    const count = people.length;
    people.forEach((p, i) => {
        // same as above
        const container = document.createElement("div");
        container.className = "flex items-center mb-2";

        const input = document.createElement("input");
        input.type = "text";
        input.value = p.name;
        input.className = "border border-primary px-2 py-1 rounded-l w-full";
        input.addEventListener("input", function() {
            people[i].name = this.value;
            updatePeople();
            loadWhoWillEat();
            loadPayerInputs();
        });

        // Delete button
        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️";
        delBtn.addEventListener("click", () => {
            people.splice(i, 1); // remove from array
            setPeopleFromArray(); // re-render inputs
        });

        container.appendChild(input);
        container.appendChild(delBtn);
        div.appendChild(container);
    });

    updatePeople();
    loadWhoWillEat();
    loadPayerInputs();
}

// Update dropdown or other elements
function updatePeople() {
    const payer = document.getElementById("payer");
    if (!payer) return;
    payer.innerHTML = "";
    people.forEach((p, i) => {
        payer.innerHTML += `<option value="${i}">${p.name}</option>`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addIngredientBtn");
  if (addBtn) addBtn.style.display = "none";
});

// ===== LOAD RECIPE OR START BLANK =====
function loadRecipe() {
    const mealName = document.getElementById("mealName").value
    const div = document.getElementById("ingredients");
    div.innerHTML = ""; 

    const addBtn = document.getElementById("addIngredientBtn");

    if (mealName.trim() === "") {
        addBtn.style.display = "none";
        return;
    }

    if (recipeDB[mealName]) {
        recipeDB[mealName].forEach(ing => {
            addIngredientRow(ing.name); // use DOM method
        });
    } else {
        addIngredientRow();
    }
    addBtn.style.display = "inline-block";
}


function addIngredientRow(name = "") {
    const div = document.getElementById("ingredients");

    const row = document.createElement("div");
    row.className = "ingredientRow flex items-center gap-2 mb-2 flex-wrap";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = name;
    nameInput.placeholder = "Ingredient name";
    nameInput.className = "ingName border border-primary px-2 py-1 rounded w-2/5 text-lg";

    const priceInput = document.createElement("input");
    priceInput.type = "number";
    priceInput.placeholder = "Price";
    priceInput.className = "ingPrice border border-primary px-2 py-1 rounded w-1/5 text-lg";

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.onclick = () => div.removeChild(row);

    row.append("Name: ", nameInput, " Price: ", priceInput, delBtn);
    div.appendChild(row);
}


// Who will eat
function loadWhoWillEat() {
    const div = document.getElementById("whoWillEat");
    div.innerHTML = "<h4 class='text-primary font-bold mb-2'>Who will eat this meal:</h4>";

    people.forEach((p, i) => {
        const container = document.createElement("div");
        container.className = "flex items-center gap-2 mb-2 flex-wrap bg-white p-2 rounded border border-primary";

        const nameLabel = document.createElement("span");
        nameLabel.innerText = p.name;
        nameLabel.className = "font-semibold w-24";

        // Create Lunch checkbox
        const lunchLabel = document.createElement("label");
        lunchLabel.className = "flex items-center gap-2 cursor-pointer";

        const lunchInput = document.createElement("input");
        lunchInput.type = "checkbox";
        lunchInput.className = "hidden peer";
        lunchInput.id = `eat_lunch_${i}`;

        const lunchBox = document.createElement("div");
        lunchBox.className = "w-5 h-5 border-2 border-primary rounded peer-checked:bg-[#9678B6] transition-colors";

        const lunchText = document.createElement("span");
        lunchText.innerText = "Lunch";

        lunchLabel.appendChild(lunchInput);
        lunchLabel.appendChild(lunchBox);
        lunchLabel.appendChild(lunchText);

        // Create Dinner checkbox
        const dinnerLabel = document.createElement("label");
        dinnerLabel.className = "flex items-center gap-2 cursor-pointer";

        const dinnerInput = document.createElement("input");
        dinnerInput.type = "checkbox";
        dinnerInput.className = "hidden peer";
        dinnerInput.id = `eat_dinner_${i}`;

        const dinnerBox = document.createElement("div");
        dinnerBox.className = "w-5 h-5 border-2 border-primary rounded peer-checked:bg-[#9678B6] transition-colors";

        const dinnerText = document.createElement("span");
        dinnerText.innerText = "Dinner";

        dinnerLabel.appendChild(dinnerInput);
        dinnerLabel.appendChild(dinnerBox);
        dinnerLabel.appendChild(dinnerText);

        container.appendChild(nameLabel);
        container.appendChild(lunchLabel);
        container.appendChild(dinnerLabel);

        div.appendChild(container);
    });
}


// Generate contribution inputs
// ===== LOAD PAYER INPUTS =====
function loadPayerInputs() {
    const div = document.getElementById("payerInputs");
    div.innerHTML = "<h4>Who paid for groceries:</h4>";

    people.forEach((p, i) => {
        const container = document.createElement("div");
        container.className = "flex items-center gap-2 mb-2";

        const label = document.createElement("label");
        label.innerText = p.name;

        const input = document.createElement("input");
        input.type = "number";
        input.id = `contrib_${i}`;
        input.placeholder = "Amount Paid";
        input.className = "border px-2 py-1 rounded w-24";

        container.appendChild(label);
        container.appendChild(input);
        div.appendChild(container);
    });
}

// ===== ADD MEAL =====
function addMeal() {
    const name = document.getElementById("mealName").value;
    const day = document.getElementById("mealDay").value;
    const table = document.getElementById("mealTable");
    const row = table.insertRow(-1);

    // Collect ingredients
    const inputs = document.querySelectorAll("#ingredients .ingredientRow");
    let ingredients = [];
    inputs.forEach(row => {
        const ingName = row.querySelector(".ingName").value.trim();
        const ingPrice = Number(row.querySelector(".ingPrice").value || 0);
        if (ingName) ingredients.push({ name: ingName, price: ingPrice });
    });

    const total = ingredients.reduce((sum, ing) => sum + ing.price, 0);

    // Collect who eats
    let eaters = [];
    people.forEach((p, i) => {
        let mealsCount = 0;
        if (document.getElementById(`eat_lunch_${i}`).checked) mealsCount++;
        if (document.getElementById(`eat_dinner_${i}`).checked) mealsCount++;
        if (mealsCount > 0) eaters.push({ name: p.name, meals: mealsCount });
    });

    const totalMeals = eaters.reduce((sum, e) => sum + e.meals, 0);
    const perMealPortion = totalMeals > 0 ? total / totalMeals : 0;

    meals.push({ day, name, total, ingredients, eaters, perMealPortion });

    // Helper to create table cells
    function createCell(row, index, content, extraClasses = "") {
        const cell = row.insertCell(index);
        cell.className = `border border-primary px-4 py-2 ${extraClasses}`;
        cell.innerHTML = content;
        return cell;
    }

    createCell(row, 0, day);
    createCell(row, 1, name);
    createCell(row, 2, ingredients.map(i => `${i.name}: ${i.price.toFixed(2)}`).join(", "));
    createCell(row, 3, total.toFixed(2));
    createCell(row, 4, perMealPortion.toFixed(2));

    // Breakdown column
    const breakdownContent = eaters.map(e => `${e.name} (${e.meals} meal${e.meals>1?'s':''})`).join(", ");
    createCell(row, 5, breakdownContent);

    createCell(row, 6, `<button class="bg-primary text-white px-3 py-1 rounded text-center">Delete</button>`);

    // Delete functionality
    const deleteBtn = row.cells[6].querySelector("button");
    deleteBtn.onclick = () => {
        meals = meals.filter(m => m.name !== name || m.day !== day); 
        table.deleteRow(row.rowIndex);
    };

    // Clear inputs
    document.getElementById("mealName").value = "";
    document.getElementById("ingredients").innerHTML = "";
    loadWhoWillEat();
}

// Add additional debt to table
function addDebtRowToTable(debt) {
    const table = document.getElementById("mealTable");
    const row = table.insertRow(-1);

    row.insertCell(0).innerText = "-"; // Day
    row.insertCell(1).innerText = debt.item; // Item Name
    row.insertCell(2).innerText = "Additional Debt"; // Notes
    row.insertCell(3).innerText = debt.amount.toFixed(2); // Total
    row.insertCell(4).innerText = debt.amount.toFixed(2); // Per Person (full amount to requester)
    row.insertCell(5).innerText = `${debt.requestedBy} → ${debt.boughtBy}`; // Breakdown
    const actionCell = row.insertCell(6);
    actionCell.innerHTML = `<button class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>`;
    actionCell.querySelector("button").onclick = () => {
        additionalDebts = additionalDebts.filter(d => d !== debt);
        table.deleteRow(row.rowIndex);
    };
}


function showToast(message) {
    const toast = document.getElementById("validationToast");
    const msg = document.getElementById("toastMessage");
    msg.innerText = message;
    toast.classList.remove("hidden");

    // Optional: auto-hide after 5 seconds
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 5000);
}

function hideToast() {
    document.getElementById("validationToast").classList.add("hidden");
}


// ===== COMPUTE PAYMENT WITH VALIDATION =====
function computePayment() {
    if (meals.length === 0) {
        showToast("No meals added yet!");
        return;
    }

    // 1️⃣ Collect contributions
    const contributions = people.map((p, i) => ({
        name: p.name,
        paid: Number(document.getElementById(`contrib_${i}`)?.value || 0)
    }));

    // 2️⃣ Compute total meals eaten
    let totalMealsEaten = meals.reduce((sum, meal) => {
        return sum + meal.eaters.reduce((s, e) => s + e.meals, 0);
    }, 0);

    if (totalMealsEaten === 0) {
        showToast("No one has eaten any meals yet!");
        return;
    }

    // 3️⃣ Compute total cost
    let totalCost = meals.reduce((sum, meal) => sum + meal.total, 0);

    // Add all additional debts
    const totalDebt = additionalDebts.reduce((sum, debt) => sum + debt.amount, 0);
    totalCost += totalDebt;

    // Validation
    const totalPaid = contributions.reduce((sum, c) => sum + c.paid, 0);
    if (totalPaid.toFixed(2) != totalCost.toFixed(2)) {
        showToast(`⚠️ Total contributions (${totalPaid.toFixed(2)}) do not match total meal cost (${totalCost.toFixed(2)}).`);
        return;
    }

    // 4️⃣ Per meal cost
    const perMealCost = totalCost / totalMealsEaten;

    // 5️⃣ Amount owed by each person
    const personOwes = people.map(p => {
        // Meals eaten
        const mealsCount = meals.reduce((sum, meal) => {
            const eater = meal.eaters.find(e => e.name === p.name);
            return sum + (eater ? eater.meals : 0);
        }, 0);

        // Total meal cost per person
        const totalMealsEaten = meals.reduce((sum, meal) => sum + meal.eaters.reduce((s, e) => s + e.meals, 0), 0);
        const totalMealCost = totalMealsEaten > 0 ? (meals.reduce((sum, meal) => sum + meal.total, 0) / totalMealsEaten) * mealsCount : 0;

        // Debts requested by this person
        const totalDebtOwe = additionalDebts
            .filter(d => d.requestedBy === p.name)
            .reduce((sum, d) => sum + d.amount, 0);

        return {
            name: p.name,
            meals: mealsCount,
            mealCost: totalMealCost,
            debtCost: totalDebtOwe,
            owe: totalMealCost + totalDebtOwe
        };
    });


    // 6️⃣ Balances
    const balances = people.map(p => {
        const owes = personOwes.find(po => po.name === p.name).owe;
        const paid = contributions.find(c => c.name === p.name).paid;
        return { name: p.name, balance: paid - owes };
    });

    // 7️⃣ Settlement
    let creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);
    let debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);
    let settlements = [];
    debtors.forEach(debtor => {
        let remaining = -debtor.balance;
        for (let i = 0; i < creditors.length; i++) {
            if (remaining <= 0) break;
            let creditor = creditors[i];
            if (creditor.balance <= 0) continue;
            let payAmount = Math.min(remaining, creditor.balance);
            settlements.push(`${debtor.name} pays ${creditor.name}: ${payAmount.toFixed(2)}`);
            remaining -= payAmount;
            creditor.balance -= payAmount;
        }
    });

    // 8️⃣ Populate sections
    const contributionsDiv = document.getElementById("contributionsList");
    contributionsDiv.innerHTML = "";
    contributions.forEach(c => {
        contributionsDiv.innerHTML += `<div>${c.name} paid: ${c.paid.toFixed(2)}</div>`;
    });

    const owedDiv = document.getElementById("amountOwedList");
    owedDiv.innerHTML = "";
    personOwes.forEach(po => {
        owedDiv.innerHTML += `<div>
            ${po.name} (${po.meals} meal${po.meals > 1 ? "s" : ""}): 
            Meal: ${po.mealCost.toFixed(2)}, 
            Debt: ${po.debtCost.toFixed(2)}, 
            <strong>Total: ${po.owe.toFixed(2)}</strong>
        </div>`;
    });


    const settlementDiv = document.getElementById("paymentResult");
    settlementDiv.innerHTML = "";
    if (settlements.length === 0) {
        settlementDiv.innerHTML = "<div>All settled, no one owes anything!</div>";
    } else {
        settlements.forEach(s => settlementDiv.innerHTML += `<div>${s}</div>`);
    }
}



// Initialize default people on load
document.addEventListener("DOMContentLoaded", () => {
    setPeople();
    loadPayerInputs();
});

