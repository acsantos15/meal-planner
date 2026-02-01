// ===== GLOBAL DATA =====
let people = [];
let meals = [];

// ===== PEOPLE =====
function setPeople() {
    const count = Number(document.getElementById("personCount").value);
    people = [];
    const div = document.getElementById("peopleInputs");
    div.innerHTML = "";

    for (let i = 0; i < count; i++) {
        people.push({ name: "Person " + (i + 1) });

        const input = document.createElement("input");
        input.type = "text";
        input.value = "Person " + (i + 1);

        // Update array when user types
        input.addEventListener("input", function() {
            people[i].name = this.value;
            updatePeople();
            loadWhoWillEat();
        });

        div.appendChild(document.createTextNode("Name: "));
        div.appendChild(input);
        div.appendChild(document.createElement("br"));
    }

    updatePeople();
    loadWhoWillEat();
}

function updatePeople() {
    const payer = document.getElementById("payer");
    payer.innerHTML = "";
    people.forEach((p, i) => {
        payer.innerHTML += `<option value="${i}">${p.name}</option>`;
    });
}

// ===== LOAD RECIPE OR START BLANK =====
function loadRecipe() {
    const mealName = document.getElementById("mealName").value.toLowerCase();
    const div = document.getElementById("ingredients");
    div.innerHTML = ""; 

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
    row.className = "ingredientRow"; // <-- important

    // Name input
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = name;
    nameInput.placeholder = "Ingredient name";
    nameInput.className = "ingName"; // <-- important

    // Price input
    const priceInput = document.createElement("input");
    priceInput.type = "number";
    priceInput.value = price;
    priceInput.placeholder = "Price";
    priceInput.className = "ingPrice"; // <-- important

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

// Who will eat
function loadWhoWillEat() {
    const div = document.getElementById("whoWillEat");
    div.innerHTML = "<h4>Who will eat this meal:</h4>";

    people.forEach((p, i) => {
        const container = document.createElement("div");

        const nameLabel = document.createElement("span");
        nameLabel.innerText = p.name + ": ";

        const lunch = document.createElement("input");
        lunch.type = "checkbox";
        lunch.value = "lunch";
        lunch.id = `eat_lunch_${i}`;

        const lunchLabel = document.createElement("label");
        lunchLabel.innerText = "Lunch";
        lunchLabel.htmlFor = lunch.id;

        const dinner = document.createElement("input");
        dinner.type = "checkbox";
        dinner.value = "dinner";
        dinner.id = `eat_dinner_${i}`;

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

    // Add row to table
    const table = document.getElementById("mealTable");
    const row = table.insertRow(-1);
    row.insertCell(0).innerText = day;
    row.insertCell(1).innerText = name;
    row.insertCell(2).innerHTML = ingredients.map(ing => `${ing.name}: ${ing.price}`).join("<br>");
    row.insertCell(3).innerText = total.toFixed(2);
    row.insertCell(4).innerText = perMealCost.toFixed(2);
    row.insertCell(5).innerHTML = eaters
    .map(e => {
        const cost = (e.meals * perMealCost).toFixed(2);
        return `${e.name} (${e.meals} meal${e.meals > 1 ? 's' : ''}): ${cost}`;
    })
    .join("<br>");

    // Delete button
    const deleteCell = row.insertCell(6);
    const btn = document.createElement("button");
    btn.innerText = "Delete";
    btn.onclick = function() {
        meals.splice(mealIndex, 1);
        table.deleteRow(row.rowIndex);
    };
    deleteCell.appendChild(btn);

    // Clear inputs
    document.getElementById("mealName").value = "";
    document.getElementById("ingredients").innerHTML = "";
    loadWhoWillEat(); // reset checkboxes for next meal
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
