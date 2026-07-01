// ===== ADD MEAL =====
import { state } from './config.js';

function addMeal() {
    const isEdit = state.editMealIndex !== null;
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
    const eatersSelected = state.people.some((p, i) => {
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
        row = table.rows[state.editMealIndex + 1]; // +1 for header row
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
    state.people.forEach((p, i) => {
        let mealsCount = 0;
        if (document.getElementById(`eat_lunch_${i}`).checked) mealsCount++;
        if (document.getElementById(`eat_dinner_${i}`).checked) mealsCount++;
        if (mealsCount > 0) eaters.push({ name: p.name, meals: mealsCount });
    });

    const totalMeals = eaters.reduce((sum, e) => sum + e.meals, 0);
    const perMealPortion = totalMeals > 0 ? total / totalMeals : 0;

    const mealData = { day, name, total, ingredients, eaters, perMealPortion };
    if (isEdit) {
        state.meals[state.editMealIndex] = mealData;
    } else {
        state.meals.push(mealData);
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
    const ingredientsList = ingredients.map(i => `<li class='text-sm text-gray-700'>${i.name}: <strong>?${i.price.toFixed(2)}</strong></li>`).join("");
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
    totalCell.innerHTML = `?${total.toFixed(2)}`;

    // Per meal portion cell
    const perMealCell = row.cells[4] || row.insertCell(4);
    perMealCell.className = "border border-primary px-4 py-2 text-center font-semibold text-blue-600";
    perMealCell.innerHTML = `?${perMealPortion.toFixed(2)}`;

    // Eaters cell
    const eatersCell = row.cells[5] || row.insertCell(5);
    eatersCell.className = "border border-primary px-4 py-2";
    eatersCell.innerHTML = `<ul class='list-disc list-inside'>${eatersList}</ul>`;

    // Action cell
    const actionCell = row.cells[6] || row.insertCell(6);
    actionCell.className = "px-4 py-2 flex flex-wrap items-center justify-center gap-2";
    actionCell.innerHTML = `
        <button class="bg-edit bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-semibold transition-colors"><i class="fa-solid fa-pen-to-square mr-1"></i>Edit</button>
        <button class="bg-del bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold transition-colors"><i class="fa-solid fa-trash mr-1"></i>Delete</button>
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
        state.people.forEach((p, i) => {
            document.getElementById(`eat_lunch_${i}`).checked = false;
            document.getElementById(`eat_dinner_${i}`).checked = false;
        });
        eaters.forEach(e => {
            const idx = state.people.findIndex(p => p.name === e.name);
            if (idx !== -1) {
                if (e.meals >= 1) document.getElementById(`eat_lunch_${idx}`).checked = true;
                if (e.meals >= 2) document.getElementById(`eat_dinner_${idx}`).checked = true;
            }
        });
        // Switch button to Update
        const btn = document.querySelector('button[onclick="addMeal()"]');
        btn.innerHTML = '<i class="fa-solid fa-pen-to-square mr-1"></i>Update Meal';
        state.editMealIndex = row.rowIndex - 1;
    };

    // Delete functionality
    const deleteBtn = row.cells[6].querySelector(".bg-del");
    deleteBtn.onclick = () => {
        state.meals.splice(row.rowIndex - 1, 1);
        table.deleteRow(row.rowIndex);
        // If editing this row, reset form
        if (state.editMealIndex === row.rowIndex - 1) {
            clearMealForm();
        }
        syncMeals();
    };

    // Clear form and reset button if not editing, or after update
    clearMealForm();
    syncMeals();
}

window.addMeal = addMeal;

function clearMealForm() {
    document.getElementById("mealName").value = "";
    document.getElementById("ingredients").innerHTML = "";
    loadWhoWillEat();
    const btn = document.querySelector('button[onclick="addMeal()"]');
    if (btn) btn.innerHTML = '<i class="fa-solid fa-plus mr-2"></i>Add Meal';
    state.editMealIndex = null;
}
// ===== ADD MEAL =====