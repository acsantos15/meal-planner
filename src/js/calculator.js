// ===== Calculator =====
import { state } from './config.js';

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
    state.people.forEach((p, i) => {
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
    const totalMealCost = state.meals.reduce((s, m) => s + (m.total || 0), 0);
    const totalDebt = state.additionalDebts.reduce((s, d) => s + (d.amount || 0), 0);
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

window.togglePayerCalculator = togglePayerCalculator;
window.appendCalc = appendCalc;
window.clearCalc = clearCalc;
window.evaluateCalc = evaluateCalc;
window.setCalcToTotal = setCalcToTotal;
window.applyCalcToSelected = applyCalcToSelected;

document.addEventListener('keydown', function(event) {
    const key = event.key;
    const calculator = document.getElementById('payerCalculator');

    // Only allow numpad functionality when the calculator is visible
    if (calculator && calculator.classList.contains('hidden')) return;

    if (event.target.tagName === 'INPUT' && event.target.type === 'text') return;

    let handled = false;
    if (key >= '0' && key <= '9') {
        appendCalc(key); 
        handled = true;
    }

    if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendCalc(key);
        handled = true;
    }

    if (key === 'Enter' || key === '=') {
        evaluateCalc(); 
        handled = true;
    }

    if (key === '.') {
        appendCalc('.'); 
        handled = true;
    }

    if (key === 'Backspace') {
        deleteLastCharacter();  
        handled = true;
    }

    if (key === 'Numpad1') { appendCalc('1'); handled = true; }
    if (key === 'Numpad2') { appendCalc('2'); handled = true; }
    if (key === 'Numpad3') { appendCalc('3'); handled = true; }
    if (key === 'Numpad4') { appendCalc('4'); handled = true; }
    if (key === 'Numpad5') { appendCalc('5'); handled = true; }
    if (key === 'Numpad6') { appendCalc('6'); handled = true; }
    if (key === 'Numpad7') { appendCalc('7'); handled = true; }
    if (key === 'Numpad8') { appendCalc('8'); handled = true; }
    if (key === 'Numpad9') { appendCalc('9'); handled = true; }
    if (key === 'Numpad0') { appendCalc('0'); handled = true; }
    if (key === 'NumpadAdd') { appendCalc('+'); handled = true; }
    if (key === 'NumpadSubtract') { appendCalc('-'); handled = true; }
    if (key === 'NumpadMultiply') { appendCalc('*'); handled = true; }
    if (key === 'NumpadDivide') { appendCalc('/'); handled = true; }
    if (key === 'NumpadDecimal') { appendCalc('.'); handled = true; }

    if (key === 'NumpadEnter') {
        evaluateCalc();
        handled = true;
    }

    if (handled) event.preventDefault();
});
// ===== Calculator =====
