// --- Toggle View Buttons ---
const gridBtn = document.getElementById("grid-view");
const listBtn = document.getElementById("list-view");

// Helper function to fade between views
async function switchView(viewFunction) {
  const container = document.getElementById("members-container");
  container.classList.add("fade-out"); // fade out
  await new Promise((resolve) => setTimeout(resolve, 400)); // wait for fade
  const response = await fetch("data/members.json");
  const data = await response.json();
  viewFunction(data.members); // display new view
  container.classList.remove("fade-out"); // fade back in
}

gridBtn.addEventListener("click", () => {
  switchView(displayGridView);
  gridBtn.classList.add("active");
  listBtn.classList.remove("active");
});

listBtn.addEventListener("click", () => {
  switchView(displayListView);
  listBtn.classList.add("active");
  gridBtn.classList.remove("active");
});

