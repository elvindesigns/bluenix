// Get elements
const viewSpecsButtons = document.querySelectorAll(".view-specs-btn");
const modal = document.getElementById("spec-modal");
const closeBtn = document.querySelector(".close-btn-product");
const modalTitle = document.getElementById("modal-title-product");
const modalSpecs = document.getElementById("modal-specs-product");

// Variable to store the paint data
let paintData;

// Fetch the JSON data when the page loads
fetch("./assets/paintData.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    paintData = data;
    // Now that data is loaded, we can set up the event listeners
    setupEventListeners();
  })
  .catch((error) => {
    console.error("Error loading paint data:", error);
    // Optionally display an error message to the user
  });

// Function to populate modal
function populateModal(paintType) {
  const paint = paintData.paints[paintType];
  modalTitle.textContent = paint.name;
  modalSpecs.innerHTML = ""; // Clear previous content

  paint.specifications.forEach((spec) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${spec.label}:</strong> ${spec.value}`;
    modalSpecs.appendChild(li);
  });

  modal.style.display = "block";
}

// Function to set up event listeners
function setupEventListeners() {
  // Add event listeners to all "View Specifications" buttons
  viewSpecsButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const paintType = button.getAttribute("data-paint");
      populateModal(paintType);
    });
  });
}

// Close modal when "X" is clicked
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
