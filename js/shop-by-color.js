document.addEventListener("DOMContentLoaded", () => {
  // Function to get URL parameter
  function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Function to calculate luminance from hex color
  function getLuminance(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  // Function to get random number between 1 and 3
  function getRandomSetNumber() {
    return Math.floor(Math.random() * 3) + 1; // Returns 1, 2, or 3
  }

  // Function to build color cards
  function buildColorCards(colors) {
    const colorGrid = document.querySelector(".color-grid");
    colorGrid.innerHTML = "";

    colors.forEach((color) => {
      const cardHolder = document.createElement("div");
      cardHolder.className = "col-lg-2 col-md-4 col-sm-6 p-0 card-holder";

      const colorCard = document.createElement("div");
      colorCard.className = "color-card";
      colorCard.style.backgroundColor = color.color;

      const setNumber = getRandomSetNumber();

      const shadowImg = document.createElement("img");
      shadowImg.src = `assets/images/shadow-0${setNumber}.png`;
      shadowImg.className = "color-effect shadow-effect";
      colorCard.appendChild(shadowImg);

      const highlightImg = document.createElement("img");
      highlightImg.src = `assets/images/highlight-0${setNumber}.png`;
      highlightImg.className = "color-effect highlight-effect";
      colorCard.appendChild(highlightImg);

      const luminance = getLuminance(color.color);
      const textColor = luminance < 0.5 ? "#ffffff" : "#000000";

      const cardText = document.createElement("div");
      cardText.className = "color-card-text";
      cardText.style.color = textColor;
      cardText.innerHTML = `<p class="bold">${color.name}</p><p>${color.id}</p>`;

      colorCard.appendChild(cardText);
      cardHolder.appendChild(colorCard);
      colorGrid.appendChild(cardHolder);
    });

    if (colors.length === 0) {
      colorGrid.innerHTML = `<p class="text-center mt-4">No matching colors found.</p>`;
    }
  }

  // Extract color from URL
  const searchColor = getUrlParameter("color")?.toLowerCase() || "";
  if (searchColor) {
    document.querySelector(".color-desc h4").textContent = `${
      searchColor.charAt(0).toUpperCase() + searchColor.slice(1)
    } Paint`;
  }

  // Fetch colors.json and paint-tips.json
  let allColors = [];
  Promise.all([
    fetch("assets/colors.json").then((response) => {
      if (!response.ok) throw new Error("Failed to load colors.json");
      return response.json();
    }),
    fetch("assets/paint-tips.json").then((response) => {
      if (!response.ok) throw new Error("Failed to load paint-tips.json");
      return response.json();
    }),
  ])
    .then(([colors, tips]) => {
      allColors = colors; // Store all colors

      // Initial display based on URL parameter
      const initialColors = searchColor
        ? allColors.filter((color) =>
            color.name.toLowerCase().includes(searchColor)
          )
        : allColors;
      buildColorCards(initialColors);

      // Display random paint tip
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      document.querySelector(".tip-hint p").textContent = randomTip.tip;

      // "All Colors" link handler
      const allColorsLink = document.querySelector(".filter-section a");
      allColorsLink.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector(".color-desc h4").textContent = "All Colors";
        buildColorCards(allColors);
      });

      // Search input handler
      const searchInput = document.querySelector(".filter-section input");
      searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const filteredColors = allColors.filter((color) =>
          color.name.toLowerCase().includes(searchTerm)
        );
        document.querySelector(".color-desc h4").textContent = searchTerm
          ? `${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)} Paint`
          : "All Colors";
        buildColorCards(filteredColors);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      document.querySelector(".color-grid").innerHTML =
        "<p>Error loading data. Please try again later.</p>";
    });
});
