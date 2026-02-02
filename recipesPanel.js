function sidebarToggle() {
  const sidebar = document.getElementById("sidebar");
  sidebar?.classList.toggle("hidden"); // optional chaining
}

document.addEventListener("DOMContentLoaded", () => {
  const recipePanel = document.getElementById("recipePanel");
  const recipeSearch = document.getElementById("recipeSearch");
  const addRecipeBtn = document.getElementById("addRecipeBtn");
  const recipeUl = document.getElementById("recipeList");

  // Ensure recipeDB exists
  if (typeof recipeDB === "undefined") window.recipeDB = {};

  // Convert recipeDB keys to array
  let recipeList = Object.keys(recipeDB);

  // Render recipe list function
  function renderRecipes(filter = "") {
    if (!recipeUl) return;
    recipeUl.innerHTML = "";

    const filtered = recipeList.filter(r =>
      r.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach(r => {
      const li = document.createElement("li");
      li.textContent = r;
      li.className =
        "cursor-pointer px-3 py-1 hover:bg-[#e46050] hover:text-white rounded";

      li.addEventListener("click", () => {
        const mealInput = document.getElementById("mealName");
        if (mealInput) mealInput.value = r;

        if (typeof loadRecipe === "function") loadRecipe();

        if (recipePanel) recipePanel.classList.add("hidden");
      });

      recipeUl.appendChild(li);
    });
  }

  // Search recipes
  if (recipeSearch) {
    recipeSearch.addEventListener("input", () => {
      renderRecipes(recipeSearch.value);
    });
  }

  // Add new recipe
  if (addRecipeBtn) {
    addRecipeBtn.addEventListener("click", () => {
      const newRecipe = prompt("Enter new recipe name:");
      if (newRecipe && !recipeList.includes(newRecipe)) {
        recipeList.push(newRecipe);
        recipeDB[newRecipe] = [];
        renderRecipes();
      }
    });
  }

  // Initial render on load
  renderRecipes();
});
