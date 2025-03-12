document.addEventListener("DOMContentLoaded", () => {
  const galleryGroups = document.getElementById("galleryGroups");
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const closeModal = document.querySelector(".close-modal");

  // Fetch showcase data
  fetch("assets/showcase.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((group) => {
        const groupDiv = document.createElement("div");
        groupDiv.className = "gallery-group";

        // Title and View All in a header div
        groupDiv.innerHTML = `
            <div class="gallery-group-header">
              <h2>${group.title}</h2>
              <a href="showcase-full.html?group=${encodeURIComponent(
                group.title
              )}" class="view-all-btn">View All</a>
            </div>
            <p>${group.description}</p>
            <div class="gallery-grid"></div>
          `;

        // Add images (limit to 6)
        const grid = groupDiv.querySelector(".gallery-grid");
        group.images.slice(0, 6).forEach((image) => {
          const img = document.createElement("img");
          img.src = image.src;
          img.alt = image.alt;
          img.addEventListener("click", () => {
            modal.style.display = "block";
            modalImg.src = image.src;
          });
          grid.appendChild(img);
        });

        galleryGroups.appendChild(groupDiv);
      });
    })
    .catch((error) => console.error("Error loading showcase data:", error));

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal on outside click
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
