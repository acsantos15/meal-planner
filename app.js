// ===== GLOBAL DATA =====
let people = [];
let meals = [];

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
        if (mealsCount > 0) {
            eaters.push({ name: p.name, meals: mealsCount });
        }
    });

    // Compute cost per meal portion
    const totalMeals = eaters.reduce((sum, e) => sum + e.meals, 0);
    const perMealCost = totalMeals > 0 ? total / totalMeals : 0;

    // Store meal
    const mealIndex = meals.length;
    meals.push({ day, name, total, ingredients, eaters, perMealCost });

    // Helper function to style each cell
    function createCell(row, index, content, extraClasses = "") {
        const cell = row.insertCell(index);
        cell.className = `border border-primary px-4 py-2 ${extraClasses}`;
        cell.innerHTML = content;
        return cell;
    }

    // Add row to table
    createCell(row, 0, day);  // Day
    createCell(row, 1, name); // Meal
    createCell(
    row,
    2,
    ingredients
        .map(
        ing => `<span class="inline-block border border-primary rounded px-2 py-1 mr-1 mb-1">${ing.name}: ${ing.price}</span>`
        )
        .join("")
    );
    createCell(row, 3, total.toFixed(2)); // Total Price
    createCell(row, 4, perMealCost.toFixed(2)); // Per Meal Portion
    createCell(
    row,
    5,
    eaters
        .map(e => {
        const cost = (e.meals * perMealCost).toFixed(2);
        return `<span class="inline-block border border-primary rounded px-2 py-1 mr-1 mb-1">${e.name} (${e.meals} meal${e.meals > 1 ? 's' : ''}): ${cost}</span>`;
        })
        .join("")
    );
    createCell(
        row,
        6, 
        `<button class="bg-primary text-white px-3 py-1 rounded bg-hover transition-colors duration-200">Delete</button>`,
        "text-center" 
    );

    const deleteBtn = row.cells[6].querySelector("button");
        deleteBtn.onclick = function () {
        meals.splice(mealIndex, 1); 
        table.deleteRow(row.rowIndex);     
    };

    // Clear inputs
    document.getElementById("mealName").value = "";
    document.getElementById("ingredients").innerHTML = "";
    loadWhoWillEat(); 
}



// ===== COMPUTE PAYMENT WITH VALIDATION =====
function computePayment() {
    if (meals.length === 0) {
        alert("No meals added yet!");
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
        alert("No one has eaten any meals yet!");
        return;
    }

    // 3️⃣ Compute total cost
    const totalCost = meals.reduce((sum, meal) => sum + meal.total, 0);

    // 3️⃣b Validation: total contributions must match total cost
    const totalPaid = contributions.reduce((sum, c) => sum + c.paid, 0);
    if (totalPaid.toFixed(2) != totalCost.toFixed(2)) {
        alert(`⚠️ Total contributions (${totalPaid.toFixed(2)}) do not match total meal cost (${totalCost.toFixed(2)}). Please adjust contributions.`);
        return; // stop calculation if invalid
    }

    // 4️⃣ Compute per meal cost
    const perMealCost = totalCost / totalMealsEaten;

    // 5️⃣ Compute how much each person owes
    const personOwes = people.map(p => {
        const mealsCount = meals.reduce((sum, meal) => {
            const eater = meal.eaters.find(e => e.name === p.name);
            return sum + (eater ? eater.meals : 0);
        }, 0);
        return {
            name: p.name,
            meals: mealsCount,
            owe: mealsCount * perMealCost
        };
    });

    // 6️⃣ Compute balances (positive = owed money, negative = owes)
    const balances = people.map(p => {
        const owes = personOwes.find(po => po.name === p.name).owe;
        const paid = contributions.find(c => c.name === p.name).paid;
        return {
            name: p.name,
            balance: paid - owes
        };
    });

    // 7️⃣ Generate settlement instructions
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

    // 8️⃣ Generate HTML
    let html = `<h4>Total Meal Cost: ${totalCost.toFixed(2)}</h4>`;
    html += `<h4>Contributions:</h4><ul>`;
    contributions.forEach(c => html += `<li>${c.name} paid: ${c.paid.toFixed(2)}</li>`);
    html += `</ul>`;

    html += `<h4>Amount Owed Based on Meals:</h4><ul>`;
    personOwes.forEach(po => html += `<li>${po.name} (${po.meals} meal${po.meals > 1 ? 's' : ''}): ${po.owe.toFixed(2)}</li>`);
    html += `</ul>`;

    html += `<h4>Settlement:</h4><ul>`;
    if (settlements.length === 0) {
        html += `<li>All settled, no one owes anything!</li>`;
    } else {
        settlements.forEach(s => html += `<li>${s}</li>`);
    }
    html += `</ul>`;

    document.getElementById("paymentResult").innerHTML = html;
}


// Initialize default people on load
document.addEventListener("DOMContentLoaded", () => {
    setPeople();
    loadPayerInputs();
});

