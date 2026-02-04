// ===== GLOBAL DATA =====
let people = [];
let meals = [];
let editMealIndex = null;
let additionalDebts = [];
// ===== GLOBAL DATA =====

// ===== Open Close Modal (Debt) =====
function openDebtModal() {
    document.getElementById("debtModal").classList.remove("hidden");
    if (additionalDebts.length === 0) addDebtRow();
}

function closeDebtModal() {
    const debtRows = document.getElementById("debtRows");
    debtRows.innerHTML = "";
    document.getElementById("debtModal").classList.add("hidden");
}
// ===== Open Close Modal (Debt) =====

// ===== Add Debt Modal Row =====
function addDebtRow() {
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

    // Amount
    const amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.min = "0";
    amountInput.placeholder = "0.00";

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
    people.forEach((p, i) => {
        const opt1 = document.createElement("option");
        opt1.value = i;
        opt1.text = p.name;

        const opt2 = opt1.cloneNode(true);

        paidBySelect.appendChild(opt1);
        requestedBySelect.appendChild(opt2);
    });

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
    delBtn.textContent = "Del";
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
    priceCell.innerHTML = `<span class='text-lg font-bold text-green-600'>Price: ₱${debt.amount.toFixed(2)}</span>`;
    priceCell.className = "text-center";
    
    const owedCell = row.insertCell(3);
    owedCell.innerHTML = `<span class='text-lg font-bold text-red-600'>Debt: ₱${debt.amount.toFixed(2)}</span>`;
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
            Delete
        </button>
    `;
    actionCell.className = "text-center";

    actionCell.querySelector("button").onclick = () => {
        additionalDebts = additionalDebts.filter(d => d !== debt);
        table.deleteRow(row.rowIndex);
    };
}
// ===== Add Debt Table Row =====


// ===== Save Debts =====
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
            const debt = { item, amount, boughtBy, requestedBy };
            additionalDebts.push(debt);
            addDebtRowToTable(debt);
        }
    }

    closeDebtModal();
    updateSettlementPreview();
}
// ===== Save Debts =====


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
        delBtn.textContent = "Del";
        delBtn.className = "bg-del text-white mx-2 px-2 py-1 rounded bg-del-hover";
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
        delBtn.textContent = "Del";
        delBtn.className = "bg-del text-white px-2 py-1 rounded bg-del-hover";
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

// ===== PEOPLE ====

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

    if (recipeDB[mealName]) {
        recipeDB[mealName].forEach(ing => {
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
    delBtn.textContent = "Del";
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

    // Add Check All buttons at the bottom
    const checkAllContainer = document.createElement("div");
    checkAllContainer.className = "flex items-center gap-2 mt-4 pt-3 border-t border-primary";

    const checkAllLunchBtn = document.createElement("button");
    checkAllLunchBtn.textContent = "Check All Lunch";
    checkAllLunchBtn.className = "bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary hover:opacity-90";
    checkAllLunchBtn.onclick = () => {
        people.forEach((p, i) => {
            document.getElementById(`eat_lunch_${i}`).checked = true;
        });
    };

    const checkAllDinnerBtn = document.createElement("button");
    checkAllDinnerBtn.textContent = "Check All Dinner";
    checkAllDinnerBtn.className = "bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary hover:opacity-90";
    checkAllDinnerBtn.onclick = () => {
        people.forEach((p, i) => {
            document.getElementById(`eat_dinner_${i}`).checked = true;
        });
    };

    const uncheckAllBtn = document.createElement("button");
    uncheckAllBtn.textContent = "Uncheck All";
    uncheckAllBtn.className = "bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500";
    uncheckAllBtn.onclick = () => {
        people.forEach((p, i) => {
            document.getElementById(`eat_lunch_${i}`).checked = false;
            document.getElementById(`eat_dinner_${i}`).checked = false;
        });
    };

    checkAllContainer.appendChild(checkAllLunchBtn);
    checkAllContainer.appendChild(checkAllDinnerBtn);
    checkAllContainer.appendChild(uncheckAllBtn);
    div.appendChild(checkAllContainer);
}
// ===== WHO WILL EAT =====


// ===== LOAD PAYER INPUTS =====
function loadPayerInputs() {
    const div = document.getElementById("payerInputs");
    div.innerHTML = "";

    people.forEach((p, i) => {
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
        currencyLabel.innerHTML = "₱";
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

// ===== ADD MEAL =====
function addMeal() {
    const isEdit = editMealIndex !== null;
    const name = document.getElementById("mealName").value;
    const day = document.getElementById("mealDay").value;
    const table = document.getElementById("mealTable");

    // --- Validation ---
    // Check if meal name is provided
    if (name.trim() === "") {
        showToast("Please enter a meal name.");
        return;
    }

    // Check if at least one person is selected to eat
    const eatersSelected = people.some((p, i) => {
        let mealsCount = 0;
        if (document.getElementById(`eat_lunch_${i}`).checked) mealsCount++;
        if (document.getElementById(`eat_dinner_${i}`).checked) mealsCount++;
        return mealsCount > 0;
    });

    if (!eatersSelected) {
        showToast("Please select at least one person to eat this meal.");
        return;
    }
    // --- Validation END ---

    // If editing, update the existing meal, else add new row
    let row;
    if (isEdit) {
        // Find the row in the table to update
        row = table.rows[editMealIndex + 1]; // +1 for header row
    } else {
        row = table.insertRow(-1);
    }

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

    const mealData = { day, name, total, ingredients, eaters, perMealPortion };
    if (isEdit) {
        meals[editMealIndex] = mealData;
    } else {
        meals.push(mealData);
    }

    // Helper to create table cells
    function createCell(row, index, content, extraClasses = "") {
        let cell = row.cells[index];
        if (!cell) cell = row.insertCell(index);
        cell.className = `border border-primary px-4 py-2 ${extraClasses}`;
        cell.innerHTML = content;
        return cell;
    }

    // Create cells with bullet points for ingredients and eaters
    const ingredientsList = ingredients.map(i => `<li class='text-sm text-gray-700'>${i.name}: <strong>₱${i.price.toFixed(2)}</strong></li>`).join("");
    const eatersList = eaters.map(e => `<li class='text-sm text-gray-700'>${e.name} <span class='text-blue-600 font-semibold'>(${e.meals} meal${e.meals > 1 ? 's' : ''})</span></li>`).join("");

    // Day cell
    const dayCell = row.cells[0] || row.insertCell(0);
    dayCell.className = "border border-primary px-4 py-2 font-semibold text-gray-800 bg-blue-50";
    dayCell.innerHTML = day;

    // Meal name cell
    const nameCell = row.cells[1] || row.insertCell(1);
    nameCell.className = "border border-primary px-4 py-2 font-bold text-lg text-gray-800";
    nameCell.innerHTML = name;

    // Ingredients cell
    const ingredientsCell = row.cells[2] || row.insertCell(2);
    ingredientsCell.className = "border border-primary px-4 py-2";
    ingredientsCell.innerHTML = `<ul class='list-disc list-inside'>${ingredientsList}</ul>`;

    // Total price cell
    const totalCell = row.cells[3] || row.insertCell(3);
    totalCell.className = "border border-primary px-4 py-2 text-center font-bold text-green-600 text-lg";
    totalCell.innerHTML = `₱${total.toFixed(2)}`;

    // Per meal portion cell
    const perMealCell = row.cells[4] || row.insertCell(4);
    perMealCell.className = "border border-primary px-4 py-2 text-center font-semibold text-blue-600";
    perMealCell.innerHTML = `₱${perMealPortion.toFixed(2)}`;

    // Eaters cell
    const eatersCell = row.cells[5] || row.insertCell(5);
    eatersCell.className = "border border-primary px-4 py-2";
    eatersCell.innerHTML = `<ul class='list-disc list-inside'>${eatersList}</ul>`;

    // Action cell
    const actionCell = row.cells[6] || row.insertCell(6);
    actionCell.className = "px-4 py-2 flex flex-wrap items-center justify-center gap-2";
    actionCell.innerHTML = `
        <button class="bg-edit bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-semibold transition-colors">Edit</button>
        <button class="bg-del bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold transition-colors">Delete</button>
    `;

    // Edit functionality
    const editBtn = row.cells[6].querySelector(".bg-edit");
    editBtn.onclick = () => {
        // Set form values
        document.getElementById("mealName").value = name;
        document.getElementById("mealDay").value = day;
        // Populate ingredients
        const ingredientsDiv = document.getElementById("ingredients");
        ingredientsDiv.innerHTML = "";
        ingredients.forEach(ing => {
            addIngredientRow();
            const lastRow = ingredientsDiv.querySelectorAll(".ingredientRow");
            const ingRow = lastRow[lastRow.length - 1];
            ingRow.querySelector(".ingName").value = ing.name;
            ingRow.querySelector(".ingPrice").value = ing.price;
        });
        // Populate eaters
        people.forEach((p, i) => {
            document.getElementById(`eat_lunch_${i}`).checked = false;
            document.getElementById(`eat_dinner_${i}`).checked = false;
        });
        eaters.forEach(e => {
            const idx = people.findIndex(p => p.name === e.name);
            if (idx !== -1) {
                if (e.meals >= 1) document.getElementById(`eat_lunch_${idx}`).checked = true;
                if (e.meals >= 2) document.getElementById(`eat_dinner_${idx}`).checked = true;
            }
        });
        // Switch button to Update
        const btn = document.querySelector('button[onclick="addMeal()"]');
        btn.textContent = "Update Meal";
        editMealIndex = row.rowIndex - 1;
    };

    // Delete functionality
    const deleteBtn = row.cells[6].querySelector(".bg-del");
    deleteBtn.onclick = () => {
        meals.splice(row.rowIndex - 1, 1);
        table.deleteRow(row.rowIndex);
        // If editing this row, reset form
        if (editMealIndex === row.rowIndex - 1) {
            clearMealForm();
        }
    };

    // Clear form and reset button if not editing, or after update
    clearMealForm();
}

function clearMealForm() {
    document.getElementById("mealName").value = "";
    document.getElementById("ingredients").innerHTML = "";
    loadWhoWillEat();
    const btn = document.querySelector('button[onclick="addMeal()"]');
    if (btn) btn.textContent = "Add Meal";
    editMealIndex = null;
}
// ===== ADD MEAL =====


// ===== UPDATE SETTLEMENT PREVIEW =====
function updateSettlementPreview() {
    computePayment(true); // true = skip validation
}
// ===== UPDATE SETTLEMENT PREVIEW =====

// ===== PAYMENT COMPUTATION =====
function computePayment(skipValidation = false) {
    if (meals.length === 0) {
        showToast("No meals added yet!");
        return;
    }

    const contributions = people.map((p, i) => ({
        name: p.name,
        paid: Number(document.getElementById(`contrib_${i}`)?.value || 0)
    }));

    const totalMealsEaten = meals.reduce((sum, meal) => {
        return sum + meal.eaters.reduce((s, e) => s + e.meals, 0);
    }, 0);

    if (totalMealsEaten === 0) {
        showToast("No one has eaten any meals yet!");
        return;
    }

    const totalMealCost = meals.reduce((sum, meal) => sum + meal.total, 0);
    const totalDebt = additionalDebts.reduce((sum, d) => sum + d.amount, 0);

    const totalPaid = contributions.reduce((sum, c) => sum + c.paid, 0);
    if (!skipValidation && totalPaid.toFixed(2) != (totalMealCost + totalDebt).toFixed(2)) {
        showToast(`Total contributions (${totalPaid.toFixed(2)}) do not match total cost (${(totalMealCost + totalDebt).toFixed(2)}).`);
        return;
    }

    const perMealCost = totalMealCost / totalMealsEaten;

    // Calculate total owed per person (meals + debts requested by them) with breakdown
    const personOwes = people.map(p => {
        const mealTotal = meals.reduce((sum, meal) => {
            const eater = meal.eaters.find(e => e.name === p.name);
            if (eater) {
                return sum + (eater.meals * meal.perMealPortion);
            }
            return sum;
        }, 0);

        const debtDetails = additionalDebts
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
    const balances = people.map(p => {
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
                <span class='text-lg font-bold text-green-600'>₱${c.paid.toFixed(2)}</span>
            </div>
        </div>
    `).join("");

    const owedDiv = document.getElementById("amountOwedList");
    owedDiv.innerHTML = personOwes.map((po, idx) => {
        const debtHtml = po.debtDetails.length > 0 
            ? po.debtDetails.map(d => `<div class='text-sm text-gray-600 mt-1'>• ${d.item}: ₱${d.cost.toFixed(2)}</div>`).join("")
            : "<div class='text-sm text-gray-500 mt-1'>• None</div>";

        return `
            <div class='border-b border-gray-300 py-3 px-2 hover:bg-yellow-50 rounded transition-colors'>
                <div class='flex justify-between items-start mb-2'>
                    <span class='font-semibold text-gray-700'>${po.name}</span>
                    <span class='text-lg font-bold text-orange-600'>₱${po.totalOwe.toFixed(2)}</span>
                </div>
                <div class='ml-2'>
                    ${debtHtml}
                </div>
            </div>
        `;
    }).join("");

    const settlementDiv = document.getElementById("paymentResult");
    settlementDiv.innerHTML = settlements.length === 0
        ? "<div class='text-center text-green-600 font-bold py-6 text-lg'>�? All settled, no one owes anything!</div>"
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
                                <span class='text-blue-500 font-bold'>�?</span>
                                <span class='font-semibold text-gray-700'>${receiver.trim()}</span>
                            </div>
                            <span class='font-bold text-blue-600'>₱${amount.trim()}</span>
                        </div>
                    </div>
                `;
            }
            return `<div class='border-b border-gray-300 py-2 px-2 hover:bg-blue-50 rounded transition-colors'>${s}</div>`;
        }).join("");
}

// ===== PAYMENT COMPUTATION =====

// ===== TOAST MESSAGE =====
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
// ===== TOAST MESSAGE ====

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
    setPeople();
    loadPayerInputs();
});
// ===== INITIALIZATION =====

const sidebar = document.getElementById("sidebar");

sidebar.addEventListener("scroll", () => {
  const scrollY = sidebar.scrollTop;
  // Move background exactly with content
  sidebar.style.backgroundPosition = `0 ${scrollY}px, 0 0`;
});


