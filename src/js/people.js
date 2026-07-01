// ===== PEOPLE =====
import { state } from './config.js';

function createPersonRow(person, index) {
    const container = document.createElement("div");
    container.className = "flex items-center mb-2";

    const input = document.createElement("input");
    input.type = "text";
    input.id = `person_${index}`;
    input.value = person.name;
    input.className = "border border-primary px-2 py-1 rounded-l w-full";
    input.addEventListener("input", function() {
        state.people[index].name = this.value;
        updatePeople();
        window.loadWhoWillEat?.();
        window.loadPayerInputs?.();
    });

    const delBtn = document.createElement("button");
    delBtn.innerHTML = '<i class="fa-solid fa-trash mr-1"></i>';
    delBtn.className = "bg-del text-white mx-2 px-2 py-1 rounded bg-del-hover";
    delBtn.addEventListener("click", () => {
        state.people.splice(index, 1);
        setPeopleFromArray();
    });

    container.appendChild(input);
    container.appendChild(delBtn);
    return container;
}

function setPeople() {
    const count = Number(document.getElementById("personCount").value);
    const div = document.getElementById("peopleInputs");
    div.innerHTML = "";

    const currentPeople = state.people.slice(0, count);
    state.people = [];

    for (let i = 0; i < count; i++) {
        const name = currentPeople[i]?.name || state.defaultNames[i] || "Person " + (i + 1);
        state.people.push({ name });
        div.appendChild(createPersonRow(state.people[i], i));
    }

    updatePeople();
    window.loadWhoWillEat?.();
    window.loadPayerInputs?.();
}

function setPeopleFromArray() {
    const div = document.getElementById("peopleInputs");
    div.innerHTML = "";
    state.people.forEach((p, i) => div.appendChild(createPersonRow(p, i)));

    updatePeople();
    window.loadWhoWillEat?.();
    window.loadPayerInputs?.();
    window.syncPeople?.();
}

window.setPeople = setPeople;

// Update dropdown or other elements
function updatePeople() {
    const payerSelect = document.getElementById("payerSelect");
    if (!payerSelect) return;
    payerSelect.innerHTML = "";
    state.people.forEach((p, i) => {
        payerSelect.innerHTML += `<option value="${i}">${p.name}</option>`;
    });
    // persist the updated list
    window.syncPeople?.();
}

// ===== PEOPLE ====