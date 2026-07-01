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

window.showToast = showToast;
window.hideToast = hideToast;
// ===== TOAST MESSAGE ====