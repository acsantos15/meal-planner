function sidebarToggle() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("mainContent");

  if (sidebar.classList.contains("hidden")) {
    // Show sidebar
    sidebar.classList.remove("hidden");
    main.style.marginRight = "16rem"; // sidebar width
  } else {
    // Hide sidebar
    sidebar.classList.add("hidden");
    main.style.marginRight = "0"; // main expands
  }
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
      li.className =
        "cursor-pointer py-1 border-t-2 border-t-[#3ca9d8]  bg-transparent w-full bg-hover-nav hover:text-white list-disc";
      
      // Create a new element for the text content (e.g., an anchor or a div)
      const textNode = document.createElement("a");
      textNode.textContent = `• ${r}`;
      textNode.className = "inline-block px-7"; // Padding applied to the text only

      li.appendChild(textNode);

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
