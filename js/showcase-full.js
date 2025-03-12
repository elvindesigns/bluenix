document.addEventListener("DOMContentLoaded", () => {
  const groupTitleEl = document.getElementById("groupTitle");
  const groupDescriptionEl = document.getElementById("groupDescription");
  const fullGallery = document.getElementById("fullGallery");
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const closeModal = document.querySelector(".close-modal");

  // Get group name from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const groupName = urlParams.get("group");

  // Fetch showcase data
  fetch("assets/showcase.json")
    .then((response) => response.json())
    .then((data) => {
      const group = data.find((g) => g.title === groupName);
      if (group) {
        // Set title and description
        groupTitleEl.textContent = `${group.title}`;
        groupDescriptionEl.textContent = group.description;

        // Load all images
        group.images.forEach((image) => {
          const img = document.createElement("img");
          img.src = image.src;
          img.alt = image.alt;
          img.addEventListener("click", () => {
            modal.style.display = "block";
            modalImg.src = image.src;
          });
          fullGallery.appendChild(img);
        });
      } else {
        groupTitleEl.textContent = "Group Not Found";
        groupDescriptionEl.textContent =
          "Sorry, we couldn’t find that gallery.";
      }
    })
    .catch((error) => {
      console.error("Error loading showcase data:", error);
      groupTitleEl.textContent = "Error";
      groupDescriptionEl.textContent = "Failed to load gallery.";
    });

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
