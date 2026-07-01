// ===========================================
// DATABASE FUNCTIONS
// ===========================================

import { supabaseClient, state } from './config.js';

// ===== PEOPLE =====

async function loadPeopleFromDb() {
    const { data, error } = await supabaseClient
        .from("people")
        .select("*")
        .order("id");

    if (error) {
        console.error("loadPeopleFromDb", error);
        return [];
    }

    return data.map(row => ({
        name: row.name
    }));
}

async function syncPeople() {
    await supabaseClient
        .from("people")
        .delete();

    if (state.people.length === 0) return;

    const rows = state.people.map((person, index) => ({
        id: index,
        name: person.name
    }));

    const { error } = await supabaseClient
        .from("people")
        .insert(rows);

    if (error) {
        console.error("syncPeople", error);
    }
}

// ===== MEALS =====

async function loadMealsFromDb() {
    const { data, error } = await supabaseClient
        .from("meals")
        .select("data");

    if (error) {
        console.error("loadMealsFromDb", error);
        return [];
    }

    return data.map(row => row.data);
}

async function syncMeals() {
    await supabaseClient
        .from("meals")
        .delete();

    if (state.meals.length === 0) return;

    const rows = state.meals.map(meal => ({
        data: meal
    }));

    const { error } = await supabaseClient
        .from("meals")
        .insert(rows);

    if (error) {
        console.error("syncMeals", error);
    }
}

// ===== DEBTS =====

async function loadDebtsFromDb() {
    const { data, error } = await supabaseClient
        .from("debts")
        .select("data");

    if (error) {
        console.error("loadDebtsFromDb", error);
        return [];
    }

    return data.map(row => row.data);
}

async function syncDebts() {
    await supabaseClient
        .from("debts")
        .delete();

    if (state.additionalDebts.length === 0) return;

    const rows = state.additionalDebts.map(debt => ({
        data: debt
    }));

    const { error } = await supabaseClient
        .from("debts")
        .insert(rows);

    if (error) {
        console.error("syncDebts", error);
    }
}

// helper used during initial load
function fillMealFormWithData(m) {
    document.getElementById("mealName").value = m.name;
    document.getElementById("mealDay").value = m.day;
    // ingredients
    const ingredientsDiv = document.getElementById("ingredients");
    ingredientsDiv.innerHTML = "";
    m.ingredients.forEach(ing => {
        window.addIngredientRow?.();
        const rows = ingredientsDiv.querySelectorAll(".ingredientRow");
        const last = rows[rows.length - 1];
        last.querySelector(".ingName").value = ing.name;
        last.querySelector(".ingPrice").value = ing.price;
    });
    // eaters
    state.people.forEach((p, i) => {
        document.getElementById(`eat_lunch_${i}`).checked = false;
        document.getElementById(`eat_dinner_${i}`).checked = false;
    });
    m.eaters.forEach(e => {
        const idx = state.people.findIndex(p => p.name === e.name);
        if (idx !== -1) {
            if (e.meals >= 1) document.getElementById(`eat_lunch_${idx}`).checked = true;
            if (e.meals >= 2) document.getElementById(`eat_dinner_${idx}`).checked = true;
        }
    });
}

async function loadInitialData() {
    // people
    state.people = await loadPeopleFromDb();
    document.getElementById("personCount").value = state.people.length || 5;
    window.setPeople?.();

    // debts
    state.additionalDebts = await loadDebtsFromDb();
    renderDebtRows();

    // meals
    state.meals = [];
    const table = document.getElementById("mealTable");
    while (table.rows.length > 1) table.deleteRow(1);
    const loaded = await loadMealsFromDb();
    loaded.forEach(m => {
        fillMealFormWithData(m);
        window.addMeal?.();
    });
}

window.addEventListener('DOMContentLoaded', loadInitialData);

// load ingredients for the current meal name from the Supabase meals table
async function loadIngredientsFromDb() {
    const mealName = document.getElementById("mealName").value.trim();
    if (!mealName) {
        showToast("Enter a meal name before loading.");
        return;
    }

    const { data, error } = await supabaseClient
        .from('meals')
        .select('data')
        .eq('data->>name', mealName)
        .limit(1);

    if (error) {
        console.error('Supabase query error', error);
        showToast('Failed to load from database');
        return;
    }

    if (!data || data.length === 0) {
        showToast('No saved meal found for "' + mealName + '"');
        return;
    }

    const m = data[0].data;
    const div = document.getElementById("ingredients");
    div.innerHTML = "";
    m.ingredients.forEach(ing => {
        window.addIngredientRow?.();
        const rows = div.querySelectorAll(".ingredientRow");
        const last = rows[rows.length - 1];
        last.querySelector(".ingName").value = ing.name;
        last.querySelector(".ingPrice").value = ing.price;
    });
    const addBtn = document.getElementById("addIngredientBtn");
    if (addBtn) addBtn.style.display = "inline-block";
}

function renderDebtRows() {
    const table = document.getElementById("mealTable");
    if (!table) return;

    // Remove existing debt rows before rendering fresh ones
    for (let i = table.rows.length - 1; i > 0; i--) {
        const row = table.rows[i];
        if (row.cells[0] && row.cells[0].innerText.includes("Additional Debt")) {
            table.deleteRow(i);
        }
    }

    state.additionalDebts.forEach(debt => window.addDebtRowToTable?.(debt));
}

window.renderDebtRows = renderDebtRows;
window.syncPeople = syncPeople;
window.syncMeals = syncMeals;
window.syncDebts = syncDebts;
window.loadIngredientsFromDb = loadIngredientsFromDb;
