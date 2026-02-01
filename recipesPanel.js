document.addEventListener("DOMContentLoaded", () => {
  const recipeBtn = document.getElementById("recipeBtn");
  const recipePanel = document.getElementById("recipePanel");
  const closePanel = document.getElementById("closePanel");
  const recipeSearch = document.getElementById("recipeSearch");
  const addRecipeBtn = document.getElementById("addRecipeBtn");
  const recipeUl = document.getElementById("recipeList");

  // Get recipes from recipes.js
  let recipeList = Object.keys(recipeDB || {});

  // Show / hide panel
  recipeBtn.addEventListener("click", () => {
    recipePanel.classList.remove("hidden");
  });

  closePanel.addEventListener("click", () => {
    recipePanel.classList.add("hidden");
  });

  // Render recipe list
  function renderRecipes(filter = "") {
    recipeUl.innerHTML = "";
    const filtered = recipeList.filter(r => r.toLowerCase().includes(filter.toLowerCase()));
    filtered.forEach(r => {
      const li = document.createElement("li");
      li.textContent = r;
      li.addEventListener("click", () => {
        document.getElementById("mealName").value = r;
        if (typeof loadRecipe === "function") loadRecipe(); // call existing function
        recipePanel.classList.add("hidden");
      });
      recipeUl.appendChild(li);
    });
  }

  // Search recipes
  recipeSearch.addEventListener("input", () => {
    renderRecipes(recipeSearch.value);
  });

  // Add new recipe
  addRecipeBtn.addEventListener("click", () => {
    const newRecipe = prompt("Enter new recipe name:");
    if (newRecipe && !recipeList.includes(newRecipe)) {
      recipeList.push(newRecipe);
      recipeDB[newRecipe] = [];
      renderRecipes();
    }
  });

  // Initial render
  renderRecipes();
});
