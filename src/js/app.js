
import { state } from './config.js';

// ===== Open Close Modal (Debt) =====
function openDebtModal() {
    const debtRows = document.getElementById("debtRows");
    debtRows.innerHTML = "";

    if (state.additionalDebts.length === 0) {
        addDebtRow();
    } else {
        state.additionalDebts.forEach(debt => addDebtRow(debt));
    }

    document.getElementById("debtModal").classList.remove("hidden");
}

function closeDebtModal() {
    document.getElementById("debtRows").innerHTML = "";
    document.getElementById("debtModal").classList.add("hidden");
}
// ===== Open Close Modal (Debt) =====

// ===== Add Debt Modal Row =====
function addDebtRow(existingDebt = null) {
    const debtRows = document.getElementById("debtRows");

    const row = document.createElement("div");
    row.className = "grid grid-cols-1 md:grid-cols-12 gap-3 items-center border-b pb-3";

    // Helper to create floating label input/select
    function createField({ label, element, colSpan }) {
        const wrapper = document.createElement("div");
        wrapper.className = `relative md:col-span-${colSpan}`;

        const lbl = document.createElement("label");
        lbl.textContent = label;
        lbl.className = "text-primary text-sm font-semibold absolute -top-2 left-2 px-1 bg-white";

        element.className += " border-2 border-primary rounded-[5px] px-3 py-2 w-full";

        wrapper.append(lbl, element);
        return wrapper;
    }

    // Item Name
    const itemInput = document.createElement("input");
    itemInput.type = "text";
    itemInput.placeholder = "Item name";
    if (existingDebt) itemInput.value = existingDebt.item;

    // Amount
    const amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.min = "0";
    amountInput.placeholder = "0.00";
    if (existingDebt) amountInput.value = existingDebt.amount;

    // Paid By
    const paidBySelect = document.createElement("select");
    const paidPlaceholder = document.createElement("option");
    paidPlaceholder.value = "";
    paidPlaceholder.text = "Select payer";
    paidPlaceholder.disabled = true;
    paidPlaceholder.selected = true;
    paidBySelect.appendChild(paidPlaceholder);

    // Requested By
    const requestedBySelect = document.createElement("select");
    const reqPlaceholder = document.createElement("option");
    reqPlaceholder.value = "";
    reqPlaceholder.text = "Select requester";
    reqPlaceholder.disabled = true;
    reqPlaceholder.selected = true;
    requestedBySelect.appendChild(reqPlaceholder);

    // Add people options
    state.people.forEach((p, i) => {
        const opt1 = document.createElement("option");
        opt1.value = i;
        opt1.text = p.name;

        const opt2 = opt1.cloneNode(true);

        paidBySelect.appendChild(opt1);
        requestedBySelect.appendChild(opt2);
    });

    if (existingDebt) {
        const paidIndex = state.people.findIndex(p => p.name === existingDebt.boughtBy);
        const reqIndex = state.people.findIndex(p => p.name === existingDebt.requestedBy);
        if (paidIndex !== -1) paidBySelect.value = paidIndex;
        if (reqIndex !== -1) requestedBySelect.value = reqIndex;
    }

    // ? Validation: cannot be same person
    function validatePeopleChange(changedSelect, otherSelect) {
        if (changedSelect.value === otherSelect.value && changedSelect.value !== "") {
            const fallback = [...otherSelect.options].find(
                (o) => o.value !== changedSelect.value && o.value !== ""
            );
            if (fallback) otherSelect.value = fallback.value;
        }
    }

    paidBySelect.onchange = () => {
        validatePeopleChange(paidBySelect, requestedBySelect);
    };

    requestedBySelect.onchange = () =>
        validatePeopleChange(requestedBySelect, paidBySelect);

    // Delete button (Placed beside other fields)
    const delBtn = document.createElement("button");
    delBtn.innerHTML = '<i class="fa-solid fa-trash mr-1"></i>';
    delBtn.className =
        "bg-del text-white px-3 py-2 rounded bg-del-hover md:col-span-1 h-fit"; 
    delBtn.onclick = () => debtRows.removeChild(row);

    row.append(
        createField({ label: "Item", element: itemInput, colSpan: 3 }),
        createField({ label: "Amount", element: amountInput, colSpan: 2 }), 
        createField({ label: "Paid By", element: paidBySelect, colSpan: 3 }),
        createField({ label: "Requested By", element: requestedBySelect, colSpan: 3 }), 
        delBtn
    );

    debtRows.appendChild(row);
}
// ===== Add Debt Modal Row =====


// ===== Add Debt Table Row =====
function addDebtRowToTable(debt) {
    const table = document.getElementById("mealTable");
    const row = table.insertRow(-1);

    row.className = "bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-150 hover:to-pink-150 transition-colors";
    
    row.insertCell(0).innerHTML = `<span class='bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold'>Additional Debt</span>`;
    
    const itemCell = row.insertCell(1);
    itemCell.innerHTML = `<strong class='text-gray-800'>Item: ${debt.item}</strong>`;
    itemCell.className = "font-semibold";
    
    const priceCell = row.insertCell(2);
    priceCell.innerHTML = `<span class='text-lg font-bold text-green-600'>Price: ?${debt.amount.toFixed(2)}</span>`;
    priceCell.className = "text-center";
    
    const owedCell = row.insertCell(3);
    owedCell.innerHTML = `<span class='text-lg font-bold text-red-600'>Debt: ?${debt.amount.toFixed(2)}</span>`;
    owedCell.className = "text-center";
    
    const reqCell = row.insertCell(4);
    reqCell.innerHTML = `<div class='mb-1'><span class='font-semibold text-gray-700'>Requested:</span> <strong class='text-gray-800'>${debt.requestedBy}</strong></div>`;
    reqCell.className = "text-center";
    
    const boughtCell = row.insertCell(5);
    boughtCell.innerHTML = `<div><span class='font-semibold text-gray-700'>Paid by:</span> <strong class='text-gray-800'>${debt.boughtBy}</strong></div>`;
    boughtCell.className = "text-center";

    const actionCell = row.insertCell(6);
    actionCell.innerHTML = `
        <button class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold transition-colors">
            <i class="fa-solid fa-trash mr-1"></i>Delete
        </button>
    `;
    actionCell.className = "text-center";

    actionCell.querySelector("button").onclick = () => {
        state.additionalDebts = state.additionalDebts.filter(d => d !== debt);
        table.deleteRow(row.rowIndex);
    };
}
// ===== Add Debt Table Row =====


// ===== Save Debts =====
function saveDebts() {
    state.additionalDebts = [];
    const rows = document.getElementById("debtRows").children;

    for (let row of rows) {
        const inputs = row.querySelectorAll("input, select");
        const item = inputs[0].value.trim();
        const amount = Number(inputs[1].value) || 0;
        const boughtBy = state.people[Number(inputs[2].value)]?.name || "Unknown";
        const requestedBy = state.people[Number(inputs[3].value)]?.name || "Unknown";

        if (item && amount > 0) {
            state.additionalDebts.push({ item, amount, boughtBy, requestedBy });
        }
    }

    if (typeof renderDebtRows === "function") {
        renderDebtRows();
    }

    closeDebtModal();
    updateSettlementPreview();
    syncDebts();
}
// ===== Save Debts =====




// ===== RECIPE =====
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addIngredientBtn");
  if (addBtn) addBtn.style.display = "none";
});

function loadRecipe() {
    const mealName = document.getElementById("mealName").value
    const div = document.getElementById("ingredients");
    div.innerHTML = ""; 

    const addBtn = document.getElementById("addIngredientBtn");

    if (mealName.trim() === "") {
        addBtn.style.display = "none";
        return;
    }

    if (window.recipeDB && window.recipeDB[mealName]) {
        window.recipeDB[mealName].forEach(ing => {
            addIngredientRow(ing.name);
        });
    } else {
        addIngredientRow();
    }
    addBtn.style.display = "inline-block";
}


function addIngredientRow(name = "") {
    const div = document.getElementById("ingredients");

    const row = document.createElement("div");
    row.className = "ingredientRow flex items-center gap-2 mb-2";

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
    delBtn.innerHTML = '<i class="fa-solid fa-trash mr-1"></i>';
    delBtn.className = "bg-del text-white px-2 py-1 rounded bg-del-hover";
    delBtn.onclick = () => div.removeChild(row);

    row.append("Name: ", nameInput, " Price: ", priceInput, delBtn);
    div.appendChild(row);
}

// ===== RECIPE =====

// ===== WHO WILL EAT =====
function loadWhoWillEat() {
    const div = document.getElementById("whoWillEat");
    div.innerHTML = "<h4 class='text-primary font-bold mb-2'>Who will eat this meal:</h4>";

    state.people.forEach((p, i) => {
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

    // Add Check All toggle buttons at the bottom
    const checkAllContainer = document.createElement("div");
    checkAllContainer.className = "flex items-center gap-2 mt-4 pt-3 border-t border-primary";

    const checkAllLunchBtn = document.createElement("button");
    checkAllLunchBtn.innerHTML = '<i class="fa-solid fa-utensils mr-1"></i>All Lunch';
    checkAllLunchBtn.className = "bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary hover:opacity-90";
    checkAllLunchBtn.onclick = () => {
        // Check if all lunch boxes are already checked
        const allChecked = state.people.every((p, i) => document.getElementById(`eat_lunch_${i}`).checked);
        state.people.forEach((p, i) => {
            document.getElementById(`eat_lunch_${i}`).checked = !allChecked;
        });
    };

    const checkAllDinnerBtn = document.createElement("button");
    checkAllDinnerBtn.innerHTML = '<i class="fa-solid fa-utensils mr-1"></i>All Dinner';
    checkAllDinnerBtn.className = "bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary hover:opacity-90";
    checkAllDinnerBtn.onclick = () => {
        // Check if all dinner boxes are already checked
        const allChecked = state.people.every((p, i) => document.getElementById(`eat_dinner_${i}`).checked);
        state.people.forEach((p, i) => {
            document.getElementById(`eat_dinner_${i}`).checked = !allChecked;
        });
    };

    checkAllContainer.appendChild(checkAllLunchBtn);
    checkAllContainer.appendChild(checkAllDinnerBtn);
    div.appendChild(checkAllContainer);

}
// ===== WHO WILL EAT =====


// ===== LOAD PAYER INPUTS =====
function loadPayerInputs() {
    const div = document.getElementById("payerInputs");
    div.innerHTML = "";

    state.people.forEach((p, i) => {
        const container = document.createElement("div");
        container.className = "border-b border-gray-300 py-2 px-2 hover:bg-purple-50 rounded transition-colors";

        const input = document.createElement("input");
        input.type = "number";
        input.id = `contrib_${i}`;
        input.placeholder = "Amount";
        input.className = "border-2 border-primary rounded px-3 py-2 w-24 text-right font-semibold focus:outline-none";

        const row = document.createElement("div");
        row.className = "flex justify-between items-center";
        
        const label = document.createElement("span");
        label.innerText = p.name;
        label.className = "font-semibold text-gray-700";
        
        const amountDisplay = document.createElement("div");
        amountDisplay.className = "flex items-center gap-1";
        const currencyLabel = document.createElement("span");
        currencyLabel.innerHTML = "?";
        currencyLabel.className = "text-gray-500 font-semibold";
        amountDisplay.appendChild(currencyLabel);
        amountDisplay.appendChild(input);

        row.appendChild(label);
        row.appendChild(amountDisplay);
        container.appendChild(row);
        div.appendChild(container);
    });
}


// ===== LOAD PAYER INPUTS =====




// ===== UPDATE SETTLEMENT PREVIEW =====
function updateSettlementPreview() {
    computePayment(true); // true = skip validation
}
// ===== UPDATE SETTLEMENT PREVIEW =====

// ===== PAYMENT COMPUTATION =====
function computePayment(skipValidation = false) {
    if (state.meals.length === 0) {
        showToast("No meals added yet!");
        return;
    }

    const contributions = state.people.map((p, i) => ({
        name: p.name,
        paid: Number(document.getElementById(`contrib_${i}`)?.value || 0)
    }));

    const totalMealsEaten = state.meals.reduce((sum, meal) => {
        return sum + meal.eaters.reduce((s, e) => s + e.meals, 0);
    }, 0);

    if (totalMealsEaten === 0) {
        showToast("No one has eaten any meals yet!");
        return;
    }

    const totalMealCost = state.meals.reduce((sum, meal) => sum + meal.total, 0);
    const totalDebt = state.additionalDebts.reduce((sum, d) => sum + d.amount, 0);

    const totalPaid = contributions.reduce((sum, c) => sum + c.paid, 0);
    if (!skipValidation && totalPaid.toFixed(2) != (totalMealCost + totalDebt).toFixed(2)) {
        showToast(`Total contributions (${totalPaid.toFixed(2)}) do not match total cost (${(totalMealCost + totalDebt).toFixed(2)}).`);
        return;
    }

    const perMealCost = totalMealCost / totalMealsEaten;

    // Calculate total owed per person (meals + debts requested by them) with breakdown
    const personOwes = state.people.map(p => {
        const mealTotal = state.meals.reduce((sum, meal) => {
            const eater = meal.eaters.find(e => e.name === p.name);
            if (eater) {
                return sum + (eater.meals * meal.perMealPortion);
            }
            return sum;
        }, 0);

        const debtDetails = state.additionalDebts
            .filter(d => d.requestedBy === p.name)
            .map(d => ({ type: "Debt", item: d.item, cost: d.amount }));

        const debtTotal = debtDetails.reduce((sum, d) => sum + d.cost, 0);

        return {
            name: p.name,
            totalOwe: mealTotal + debtTotal,
            debtDetails // Only include debts here, not meal details
        };
    });

    // Calculate balances
    const balances = state.people.map(p => {
        const owed = personOwes.find(po => po.name === p.name).totalOwe;
        const paid = contributions.find(c => c.name === p.name).paid;
        return { name: p.name, balance: paid - owed };
    });

    let creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);
    let debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);

    const settlements = [];
    debtors.forEach(debtor => {
        let remaining = -debtor.balance;
        for (let i = 0; i < creditors.length; i++) {
            if (remaining <= 0) break;
            const creditor = creditors[i];
            if (creditor.balance <= 0) continue;
            const payAmount = Math.min(remaining, creditor.balance);
            settlements.push(`${debtor.name} pays ${creditor.name}: ${payAmount.toFixed(2)}`);
            remaining -= payAmount;
            creditor.balance -= payAmount;
        }
    });

    // Display
    const contributionsDiv = document.getElementById("contributionsList");
    contributionsDiv.innerHTML = contributions.map((c, idx) => `
        <div class='border-b border-gray-300 py-2 px-2 hover:bg-green-50 rounded transition-colors'>
            <div class='flex justify-between items-center'>
                <span class='font-semibold text-gray-700'>${c.name}</span>
                <span class='text-lg font-bold text-green-600'>?${c.paid.toFixed(2)}</span>
            </div>
        </div>
    `).join("");

    const owedDiv = document.getElementById("amountOwedList");
    owedDiv.innerHTML = personOwes.map((po, idx) => {
        const debtHtml = po.debtDetails.length > 0 
            ? po.debtDetails.map(d => `<div class='text-sm text-gray-600 mt-1'>? ${d.item}: ?${d.cost.toFixed(2)}</div>`).join("")
            : "<div class='text-sm text-gray-500 mt-1'>? None</div>";

        return `
            <div class='border-b border-gray-300 py-3 px-2 hover:bg-yellow-50 rounded transition-colors'>
                <div class='flex justify-between items-start mb-2'>
                    <span class='font-semibold text-gray-700'>${po.name}</span>
                    <span class='text-lg font-bold text-orange-600'>?${po.totalOwe.toFixed(2)}</span>
                </div>
                <div class='ml-2'>
                    ${debtHtml}
                </div>
            </div>
        `;
    }).join("");

    const settlementDiv = document.getElementById("paymentResult");
    settlementDiv.innerHTML = settlements.length === 0
        ? "<div class='text-center text-green-600 font-bold py-6 text-lg'>All settled! No one owes anything.</div>"
        : settlements.map((s, idx) => {
            // Parse the settlement string to extract names and amount
            const match = s.match(/(.+?) pays (.+?): (.+)/);
            if (match) {
                const [_, payer, receiver, amount] = match;
                return `
                    <div class='border-b border-gray-300 py-2 px-2 hover:bg-blue-50 rounded transition-colors'>
                        <div class='flex justify-between items-center'>
                            <div class='flex items-center gap-2 flex-1'>
                                <span class='font-semibold text-gray-700'>${payer.trim()}</span>
                                <span class='text-blue-500 font-bold'>-></span>
                                <span class='font-semibold text-gray-700'>${receiver.trim()}</span>
                            </div>
                            <span class='font-bold text-blue-600'>?${amount.trim()}</span>
                        </div>
                    </div>
                `;
            }
            return `<div class='border-b border-gray-300 py-2 px-2 hover:bg-blue-50 rounded transition-colors'>${s}</div>`;
        }).join("");
}

// ===== PAYMENT COMPUTATION =====


// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
    setPeople();
    loadPayerInputs();
});
// ===== INITIALIZATION =====

window.openDebtModal = openDebtModal;
window.closeDebtModal = closeDebtModal;
window.addDebtRow = addDebtRow;
window.addDebtRowToTable = addDebtRowToTable;
window.saveDebts = saveDebts;
window.loadRecipe = loadRecipe;
window.addIngredientRow = addIngredientRow;
window.computePayment = computePayment;
window.loadWhoWillEat = loadWhoWillEat;
window.loadPayerInputs = loadPayerInputs;
window.updateSettlementPreview = updateSettlementPreview;

window.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;
    sidebar.addEventListener("scroll", () => {
        const scrollY = sidebar.scrollTop;
        sidebar.style.backgroundPosition = `0 ${scrollY}px, 0 0`;
    });
});
