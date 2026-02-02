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
        input.className = "border border-[#e46050] px-2 py-1 rounded-l w-full";
        input.addEventListener("input", function() {
            people[i].name = this.value;
            updatePeople();
            loadWhoWillEat();
        });

        // Delete button
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "bg-red-500 text-white px-3 py-1 rounded-r hover:bg-red-600 ml-1 transition-colors duration-200";
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
        input.className = "border border-[#e46050] px-2 py-1 rounded-l w-full";
        input.addEventListener("input", function() {
            people[i].name = this.value;
            updatePeople();
            loadWhoWillEat();
        });

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "bg-red-500 text-white px-3 py-1 rounded-r hover:bg-red-600 ml-1 transition-colors duration-200";
        delBtn.addEventListener("click", () => {
            people.splice(i, 1);
            setPeopleFromArray();
        });

        container.appendChild(input);
        container.appendChild(delBtn);
        div.appendChild(container);
    });

    updatePeople();
    loadWhoWillEat();
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

// Initialize default people on load
document.addEventListener("DOMContentLoaded", () => {
    setPeople();
});

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addIngredientBtn");
  if (addBtn) addBtn.style.display = "none";
});

// ===== LOAD RECIPE OR START BLANK =====
function loadRecipe() {
    const mealName = document.getElementById("mealName").value.toLowerCase();
    const div = document.getElementById("ingredients");
    div.innerHTML = ""; 

    const addBtn = document.getElementById("addIngredientBtn");

    if (mealName.trim() === "") {
        addBtn.style.display = "none";
        return;
    }

    if (recipeDB[mealName]) {
        recipeDB[mealName].forEach(ing => {
            addIngredientRow(ing.name, ing.price); // use DOM method
        });
    } else {
        addIngredientRow();
    }
    addBtn.style.display = "inline-block";
}


function addIngredientRow(name = "", price = 0) {
    const div = document.getElementById("ingredients");

    // Row container
    const row = document.createElement("div");
    row.className = "ingredientRow flex items-center gap-2 mb-2 flex-wrap"; 
    // note: 'ingredientRow' is required for querySelectorAll

    // Name input
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = name;
    nameInput.placeholder = "Ingredient name";
    nameInput.className = "ingName border border-[#e46050] px-2 py-1 rounded w-2/5 text-lg"; 
    // **class 'ingName' added here**

    // Price input
    const priceInput = document.createElement("input");
    priceInput.type = "number";
    priceInput.value = price;
    priceInput.placeholder = "Price";
    priceInput.className = "ingPrice border border-[#e46050] px-2 py-1 rounded w-1/5 text-lg"; 
    // **class 'ingPrice' added here**

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-200 text-lg";
    delBtn.addEventListener("click", () => {
        div.removeChild(row); // remove this ingredient row
    });

    // Append elements to row
    row.appendChild(document.createTextNode("Name: "));
    row.appendChild(nameInput);
    row.appendChild(document.createTextNode(" Price: "));
    row.appendChild(priceInput);
    row.appendChild(delBtn);

    // Add row to container
    div.appendChild(row);
}

// Who will eat
function loadWhoWillEat() {
    const div = document.getElementById("whoWillEat");
    div.innerHTML = "<h4 class='text-[#e46050] font-bold mb-2'>Who will eat this meal:</h4>";

    people.forEach((p, i) => {
        const container = document.createElement("div");
        container.className = "flex items-center gap-4 mb-2 flex-wrap bg-white p-2 rounded border border-[#e46050]";

        const nameLabel = document.createElement("span");
        nameLabel.innerText = p.name;
        nameLabel.className = "font-semibold w-24";

        // Lunch checkbox with visible red color using custom class
        const lunch = document.createElement("input");
        lunch.type = "checkbox";
        lunch.value = "lunch";
        lunch.id = `eat_lunch_${i}`;
        lunch.className = "w-5 h-5 checkbox-red";

        const lunchLabel = document.createElement("label");
        lunchLabel.innerText = "Lunch";
        lunchLabel.htmlFor = lunch.id;
        lunchLabel.className = "mr-4";

        // Dinner checkbox
        const dinner = document.createElement("input");
        dinner.type = "checkbox";
        dinner.value = "dinner";
        dinner.id = `eat_dinner_${i}`;
        dinner.className = "w-5 h-5 checkbox-red";

        const dinnerLabel = document.createElement("label");
        dinnerLabel.innerText = "Dinner";
        dinnerLabel.htmlFor = dinner.id;

        container.appendChild(nameLabel);
        container.appendChild(lunch);
        container.appendChild(lunchLabel);
        container.appendChild(dinner);
        container.appendChild(dinnerLabel);

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
        cell.className = `border border-[#e46050] px-4 py-2 ${extraClasses}`;
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
        ing => `<span class="inline-block border border-[#e46050] rounded px-2 py-1 mr-1 mb-1">${ing.name}: ${ing.price}</span>`
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
        return `<span class="inline-block border border-[#e46050] rounded px-2 py-1 mr-1 mb-1">${e.name} (${e.meals} meal${e.meals > 1 ? 's' : ''}): ${cost}</span>`;
        })
        .join("")
    );
    createCell(
        row,
        6, 
        `<button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-200">Delete</button>`,
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



// ===== COMPUTE PAYMENT =====
function computePayment() {
    let payerIndex = Number(document.getElementById("payer").value);
    let extra = Number(document.getElementById("extraDebt").value);

    let totalCost = meals.reduce((sum, meal) => sum + meal.total, 0) + extra;
    let perPerson = totalCost / people.length;

    let html = `<h4>Total Cost: ${totalCost.toFixed(2)}</h4>`;
    html += `<p>${people[payerIndex].name} paid</p><ul>`;
    people.forEach((p,i)=>{
        if(i !== payerIndex){
            html += `<li>${p.name} owes ${perPerson.toFixed(2)}</li>`;
        }
    });
    html += "</ul>";

    document.getElementById("paymentResult").innerHTML = html;
}
