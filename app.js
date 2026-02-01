// ===== GLOBAL DATA =====
let people = [];
let meals = [];

// Hardcoded recipes
const recipeDB = {
    "fried rice": [
        {name: "Rice", price: 50},
        {name: "Egg", price: 20},
        {name: "Oil", price: 10}
    ],
    "chicken adobo": [
        {name: "Chicken", price: 200},
        {name: "Soy Sauce", price: 30},
        {name: "Vinegar", price: 20}
    ]
};

// ===== PEOPLE =====
function setPeople() {
    let count = Number(document.getElementById("personCount").value);
    people = [];
    let div = document.getElementById("peopleInputs");
    div.innerHTML = "";

    for (let i = 0; i < count; i++) {
        people.push({name: "Person " + (i+1)});
        div.innerHTML += `
            Name: <input value="Person ${i+1}" onchange="people[${i}].name=this.value"><br>
        `;
    }
    updatePayer();
}

function updatePayer() {
    let payer = document.getElementById("payer");
    payer.innerHTML = "";
    people.forEach((p, i) => {
        payer.innerHTML += `<option value="${i}">${p.name}</option>`;
    });
}

// ===== LOAD RECIPE OR START BLANK =====
function loadRecipe() {
    const mealName = document.getElementById("mealName").value.toLowerCase();
    const div = document.getElementById("ingredients");
    div.innerHTML = ""; // clear ingredients container first

    const addBtn = document.getElementById("addIngredientBtn");

    if (mealName.trim() === "") {
        // Empty input → hide button
        addBtn.style.display = "none";
        return;
    }

    if (recipeDB[mealName]) {
        // Meal exists → show ingredients
        recipeDB[mealName].forEach(ing => {
            addIngredientRow(ing.name, ing.price); // use DOM method
        });
    } else {
        // Meal not in recipeDB → show one blank row
        addIngredientRow();
    }

    // Show the + Ingredient button **always** when meal input is not empty
    addBtn.style.display = "inline-block";
}




// Add one ingredient input row (dynamic)
// Add ingredient row dynamically without clearing existing inputs
function addIngredientRow(name = "", price = 0) {
    const div = document.getElementById("ingredients");

    const row = document.createElement("div");

    // Name input
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = name;
    nameInput.placeholder = "Ingredient name";

    // Price input
    const priceInput = document.createElement("input");
    priceInput.type = "number";
    priceInput.value = price;
    priceInput.placeholder = "Price";

    // Append inputs to row
    row.appendChild(document.createTextNode("Name: "));
    row.appendChild(nameInput);
    row.appendChild(document.createTextNode(" Price: "));
    row.appendChild(priceInput);

    row.appendChild(document.createElement("br"));

    div.appendChild(row); // add row to ingredients container
}



// Single ingredient row HTML
function ingredientRow(name, price) {
    return `Name: <input value="${name}"> Price: <input type="number" value="${price}"><br>`;
}


// ===== ADD MEAL =====
function addMeal() {
    const name = document.getElementById("mealName").value;
    const day = document.getElementById("mealDay").value;
    const inputs = document.querySelectorAll("#ingredients input");

    // Collect ingredients
    let ingredients = [];
    for (let i = 0; i < inputs.length; i += 2) {
        const ingName = inputs[i].value.trim();
        const ingPrice = Number(inputs[i + 1].value || 0);
        if (ingName !== "") {
            ingredients.push({ name: ingName, price: ingPrice });
        }
    }

    // Calculate total price
    let total = ingredients.reduce((sum, ing) => sum + ing.price, 0);
    let perPerson = total / people.length;

    // Add meal to array
    const mealIndex = meals.length;
    meals.push({ day, name, total, ingredients });

    // Add row to table
    const table = document.getElementById("mealTable");
    const row = table.insertRow(-1);
    row.insertCell(0).innerText = day;
    row.insertCell(1).innerText = name;

    // BREAKDOWN CELL
    row.insertCell(2).innerHTML = ingredients.map(ing => `${ing.name}: ${ing.price}`).join("<br>");
    row.insertCell(3).innerText = total;
    row.insertCell(4).innerText = perPerson.toFixed(2);

    // Delete button
    const deleteCell = row.insertCell(5);
    const btn = document.createElement("button");
    btn.innerText = "Delete";
    btn.onclick = function() {
        meals.splice(mealIndex, 1);
        table.deleteRow(row.rowIndex);
    }
    deleteCell.appendChild(btn);

    // Clear inputs
    document.getElementById("mealName").value = "";
    document.getElementById("ingredients").innerHTML = "";
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
