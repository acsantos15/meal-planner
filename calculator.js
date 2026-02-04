// ===== Calculator =====
function togglePayerCalculator() {
    const el = document.getElementById('payerCalculator');
    if (!el) return;
    el.classList.toggle('hidden');
    el.setAttribute('aria-hidden', el.classList.contains('hidden'));
    if (!el.classList.contains('hidden')) populatePayerSelect();
}

function populatePayerSelect() {
    const sel = document.getElementById('payerSelect');
    if (!sel) return;
    sel.innerHTML = '';
    people.forEach((p, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.text = p.name;
        sel.appendChild(opt);
    });
}

function appendCalc(ch) {
    const d = document.getElementById('calcDisplay');
    if (!d) return;
    if (d.value === '0') d.value = ch;
    else d.value += ch;
}

function clearCalc() {
    const d = document.getElementById('calcDisplay');
    if (!d) return;
    d.value = '0';
}

function deleteLastCharacter() {
    const d = document.getElementById('calcDisplay');
    if (!d || d.value === '0') return; 
    d.value = d.value.slice(0, -1);
    if (d.value === '') d.value = '0';
}

function evaluateCalc() {
    const d = document.getElementById('calcDisplay');
    if (!d) return;
    try {
        const v = Function('"use strict"; return (' + d.value + ')')();
        d.value = Number(v).toFixed(2);
    } catch (e) {
        showToast('Invalid expression');
    }
}

function setCalcToTotal() {
    const totalMealCost = meals.reduce((s, m) => s + (m.total || 0), 0);
    const totalDebt = additionalDebts.reduce((s, d) => s + (d.amount || 0), 0);
    const total = totalMealCost + totalDebt;
    const d = document.getElementById('calcDisplay');
    if (d) d.value = total.toFixed(2);
}

function applyCalcToSelected() {
    const sel = document.getElementById('payerSelect');
    if (!sel) return;
    const idx = Number(sel.value);
    if (isNaN(idx)) { showToast('Select a person to apply amount to'); return; }
    const val = Number(document.getElementById('calcDisplay').value) || 0;
    const input = document.getElementById(`contrib_${idx}`);
    if (input) input.value = val.toFixed(2);
    else showToast('Payer inputs not loaded yet');
}

document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (event.target.tagName === 'INPUT' && event.target.type === 'text') return;

    if (key >= '0' && key <= '9') {
        appendCalc(key); 
    }

    if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendCalc(key);
    }

    if (key === 'Enter' || key === '=') {
        evaluateCalc(); 
    }

    if (key === '.') {
        appendCalc('.'); 
    }

    if (key === 'Backspace') {
        deleteLastCharacter();  
    }

    if (key === 'Numpad1') appendCalc('1');
    if (key === 'Numpad2') appendCalc('2');
    if (key === 'Numpad3') appendCalc('3');
    if (key === 'Numpad4') appendCalc('4');
    if (key === 'Numpad5') appendCalc('5');
    if (key === 'Numpad6') appendCalc('6');
    if (key === 'Numpad7') appendCalc('7');
    if (key === 'Numpad8') appendCalc('8');
    if (key === 'Numpad9') appendCalc('9');
    if (key === 'Numpad0') appendCalc('0');
    if (key === 'NumpadAdd') appendCalc('+');
    if (key === 'NumpadSubtract') appendCalc('-');
    if (key === 'NumpadMultiply') appendCalc('*');
    if (key === 'NumpadDivide') appendCalc('/');
    if (key === 'NumpadDecimal') appendCalc('.');

    if (key === 'NumpadEnter') {
        evaluateCalc();
    }

    event.preventDefault();
});
// ===== Calculator =====