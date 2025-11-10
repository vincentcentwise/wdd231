// --- Load and display members ---
async function loadMembers() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) throw new Error("Failed to load members.json");
    const data = await response.json();
    displayGridView(data.members); // Default to grid view
  } catch (error) {
    console.error("Error loading members:", error);
  }
}

// --- Display Grid View ---
function displayGridView(members) {
  const container = document.getElementById("members-container");
  container.className = "grid-view";
  container.innerHTML = "";

  members.forEach((member) => {
    const card = document.createElement("div");
    card.classList.add("member-card");
    card.innerHTML = `
      <img src="images/${member.image}" alt="${member.name}">
      <h3>${member.name}</h3>
      <p>${member.address}</p>
      <p>${member.phone}</p>
      <a href="${member.website}" target="_blank">${member.website}</a>
      <p>Membership Level: ${member.level}</p>
    `;
    container.appendChild(card);
  });
}

// --- Display List View ---
function displayListView(members) {
  const container = document.getElementById("members-container");
  container.className = "list-view";

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Company / Name</th>
        <th>Year</th>
        <th>Details</th>
      </tr>
    </thead>
  `;

  const tbody = document.createElement("tbody");
  members.forEach((member) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${member.name}</td>
      <td>${member.year}</td>
      <td><a href="${member.website}" target="_blank">Details</a></td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.innerHTML = "";
  container.appendChild(table);
}

// --- Toggle View Buttons ---
const gridBtn = document.getElementById("grid-view");
const listBtn = document.getElementById("list-view");

gridBtn.addEventListener("click", async () => {
  const response = await fetch("data/members.json");
  const data = await response.json();
  displayGridView(data.members);

  gridBtn.classList.add("active");
  listBtn.classList.remove("active");
});

listBtn.addEventListener("click", async () => {
  const response = await fetch("data/members.json");
  const data = await response.json();
  displayListView(data.members);

  listBtn.classList.add("active");
  gridBtn.classList.remove("active");
});

// --- Footer Info ---
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;


// --- MOBILE NAV TOGGLE ---
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("show");

  // Optionally change button icon between ☰ and ✖
  if (navMenu.classList.contains("show")) {
    menuToggle.textContent = "✖"; // close icon
  } else {
    menuToggle.textContent = "☰"; // hamburger icon
  }
});


// --- Initialize ---
loadMembers();
