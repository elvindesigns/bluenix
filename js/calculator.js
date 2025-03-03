document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("paintCalculatorForm");
  const wallsContainer = document.getElementById("wallsContainer");
  const addWallButton = document.getElementById("addWallButton");
  const wastage = document.getElementById("wastage");
  const paintArea = document.getElementById("paintArea");
  const paintLiters = document.getElementById("paintLiters");
  const areaUnit = document.getElementById("areaUnit");
  const unitsMeters = document.getElementById("meters");
  const unitsFeet = document.getElementById("feet");
  const resetButton = document.getElementById("resetButton");

  // Constants
  const COVERAGE_PER_LITER = 6.5; // 6.5 m² per liter
  const FEET_TO_METERS = 0.3048; // Conversion factor
  let wallCount = 1; // Start with Wall 1

  // Update slider values display for a specific wall
  function updateSliderValues(wallSection) {
    const widthValue = wallSection.querySelector(".wall-width-value");
    const heightValue = wallSection.querySelector(".wall-height-value");
    const coatsValue = wallSection.querySelector(".coats-value");
    const widthSlider = wallSection.querySelector("input[name^='wallWidth']");
    const heightSlider = wallSection.querySelector("input[name^='wallHeight']");
    const coatsSlider = wallSection.querySelector("input[name^='coats']");

    widthValue.textContent = widthSlider.value;
    heightValue.textContent = heightSlider.value;
    coatsValue.textContent = coatsSlider.value;
  }

  // Calculate paint requirements for all walls
  function calculatePaint() {
    const walls = wallsContainer.querySelectorAll(".wall-section");
    let totalArea = 0;
    let totalCoatedArea = 0;
    const isWastage = wastage.checked;
    const isMeters = unitsMeters.checked;

    walls.forEach((wall) => {
      let width = parseFloat(
        wall.querySelector("input[name^='wallWidth']").value
      );
      let height = parseFloat(
        wall.querySelector("input[name^='wallHeight']").value
      );
      const numCoats = parseInt(
        wall.querySelector("input[name^='coats']").value
      );

      // Convert to meters if in feet
      if (!isMeters) {
        width *= FEET_TO_METERS;
        height *= FEET_TO_METERS;
      }

      // Calculate area for this wall (not multiplied by coats)
      let area = width * height;
      totalArea += area;
      totalCoatedArea += area * numCoats;
    });

    // Add 10% wastage if checked (applied to base area before coats)
    if (isWastage) {
      totalArea *= 1.1;
      totalCoatedArea *= 1.1;
    }

    // Calculate liters
    const liters = totalCoatedArea / COVERAGE_PER_LITER;

    // Update display
    paintArea.textContent = isMeters
      ? totalArea.toFixed(2)
      : (totalArea / FEET_TO_METERS / FEET_TO_METERS).toFixed(2);
    areaUnit.textContent = isMeters ? "m²" : "ft²";
    paintLiters.textContent = liters.toFixed(2);
  }

  // Update units display for all walls
  function updateUnits() {
    const isMeters = unitsMeters.checked;
    const walls = wallsContainer.querySelectorAll(".wall-section");

    walls.forEach((wall) => {
      wall.querySelector(".width-unit").textContent = isMeters ? "m" : "ft";
      wall.querySelector(".height-unit").textContent = isMeters ? "m" : "ft";
      const widthSlider = wall.querySelector("input[name^='wallWidth']");
      const heightSlider = wall.querySelector("input[name^='wallHeight']");
      widthSlider.max = isMeters ? 20 : 65;
      heightSlider.max = isMeters ? 10 : 33;
      updateSliderValues(wall);
    });

    calculatePaint();
  }

  // Add a new wall section
  function addWall() {
    wallCount++;
    const wallSection = document.createElement("div");
    wallSection.className = "wall-section";
    wallSection.dataset.wallId = wallCount;
    wallSection.innerHTML = `
        <h4>Wall ${wallCount} <button type="button" class="remove-wall-button">Remove</button></h4>
        <div class="form-group">
          <label for="wallWidth${wallCount}">Wall Width (<span class="width-unit">m</span>): <span class="wall-width-value">3.1</span></label>
          <input type="range" id="wallWidth${wallCount}" name="wallWidth${wallCount}" min="1" max="20" step="0.1" value="3.1">
        </div>
        <div class="form-group">
          <label for="wallHeight${wallCount}">Wall Height (<span class="height-unit">m</span>): <span class="wall-height-value">2.4</span></label>
          <input type="range" id="wallHeight${wallCount}" name="wallHeight${wallCount}" min="1" max="10" step="0.1" value="2.4">
        </div>
        <div class="form-group">
          <label for="coats${wallCount}">Number of Coats: <span class="coats-value">1</span></label>
          <input type="range" id="coats${wallCount}" name="coats${wallCount}" min="1" max="3" step="1" value="1">
        </div>
      `;
    wallsContainer.appendChild(wallSection);

    // Add event listeners to new sliders
    const widthSlider = wallSection.querySelector(`#wallWidth${wallCount}`);
    const heightSlider = wallSection.querySelector(`#wallHeight${wallCount}`);
    const coatsSlider = wallSection.querySelector(`#coats${wallCount}`);
    const removeButton = wallSection.querySelector(".remove-wall-button");

    widthSlider.addEventListener("input", () => {
      updateSliderValues(wallSection);
      calculatePaint();
    });
    heightSlider.addEventListener("input", () => {
      updateSliderValues(wallSection);
      calculatePaint();
    });
    coatsSlider.addEventListener("input", () => {
      updateSliderValues(wallSection);
      calculatePaint();
    });
    removeButton.addEventListener("click", () => {
      wallSection.remove();
      calculatePaint();
    });

    updateUnits(); // Ensure new wall respects current units
  }

  // Reset form
  function resetForm() {
    const wall1 = wallsContainer.querySelector(
      ".wall-section[data-wall-id='1']"
    );
    wall1.querySelector("#wallWidth1").value = 3.1;
    wall1.querySelector("#wallHeight1").value = 2.4;
    wall1.querySelector("#coats1").value = 1;
    wastage.checked = false;
    unitsMeters.checked = true;
    unitsFeet.checked = false;

    // Remove additional walls
    const walls = wallsContainer.querySelectorAll(".wall-section");
    walls.forEach((wall) => {
      if (wall.dataset.wallId !== "1") wall.remove();
    });
    wallCount = 1;

    updateUnits();
  }

  // Event listeners for Wall 1
  const wall1 = wallsContainer.querySelector(".wall-section[data-wall-id='1']");
  const wallWidth1 = wall1.querySelector("#wallWidth1");
  const wallHeight1 = wall1.querySelector("#wallHeight1");
  const coats1 = wall1.querySelector("#coats1");

  wallWidth1.addEventListener("input", () => {
    updateSliderValues(wall1);
    calculatePaint();
  });
  wallHeight1.addEventListener("input", () => {
    updateSliderValues(wall1);
    calculatePaint();
  });
  coats1.addEventListener("input", () => {
    updateSliderValues(wall1);
    calculatePaint();
  });

  // Other event listeners
  wastage.addEventListener("change", calculatePaint);
  unitsMeters.addEventListener("change", updateUnits);
  unitsFeet.addEventListener("change", updateUnits);
  addWallButton.addEventListener("click", addWall);
  resetButton.addEventListener("click", resetForm);

  // Initial setup
  updateUnits();
});
