document.addEventListener("DOMContentLoaded", () => {
  const follower = document.querySelector(".cursor-follower");
  const contentWrapper = document.querySelector(".content-wrapper");
  const heroSection = document.querySelector(".hero-section");
  const navbar = document.querySelector(".navbar");
  const sliderWrapper = document.querySelector(".slider-wrapper");
  const prevButton = document.querySelector(".slider-prev");
  const nextButton = document.querySelector(".slider-next");
  let mouseX = 0;
  let mouseY = 0;
  let followX = 0;
  let followY = 0;
  let radiusInner = 10;
  let radiusOuter = 10;
  let targetRadiusInner = 10;
  let targetRadiusOuter = 10;
  let velocityInner = 0;
  let velocityOuter = 0;
  let timeoutId = null;
  let lastScrollPosition = 0;
  let currentSlide = 0;
  const totalCards = 12;
  const itemWidth = 250;

  // Explicitly set scroll restoration to auto
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "auto";
    console.log("Scroll restoration set to:", history.scrollRestoration);
  }

  // Log initial scroll position
  console.log("Initial scrollY on DOMContentLoaded:", window.scrollY);

  // Set initial navbar state
  navbar.classList.add("visible");

  // Mouse movement handler
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    targetRadiusInner = 300;
    targetRadiusOuter = 305;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      targetRadiusInner = 10;
      targetRadiusOuter = 10;
    }, 1000);

    const navbarRect = navbar.getBoundingClientRect();
    const isInNavbar =
      mouseX >= navbarRect.left &&
      mouseX <= navbarRect.right &&
      mouseY >= navbarRect.top &&
      mouseY <= navbarRect.bottom;
    updateCursorDisplay(isInNavbar);
  });

  // Scroll handler for navbar visibility only
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const heroSectionTop = heroSection.getBoundingClientRect().top;
      const heroSectionBottom = heroSectionTop + heroSection.offsetHeight;
      const scrollPosition = window.scrollY;

      console.log("Scroll event - scrollY:", scrollPosition);

      const isHeroVisible = heroSectionBottom > 0;
      navbar.classList.toggle("white-bg", !isHeroVisible);

      const isAtTop = scrollPosition === 0;
      const isOutsideHero = heroSectionTop + heroSection.offsetHeight <= 0;
      navbar.classList.toggle("visible", isAtTop || isOutsideHero);

      updateCursorDisplay(isOutsideHero);
      lastScrollPosition = scrollPosition;
    }, 50);
  });

  // Slider navigation
  function updateSlider() {
    const cardWidth = itemWidth;
    const translateX = -currentSlide * cardWidth;
    sliderWrapper.style.transform = `translateX(${translateX}px)`;
    sliderWrapper.style.width = `${totalCards * cardWidth}px`;

    const viewportWidth = window.innerWidth;
    const visibleCards = Math.floor(viewportWidth / cardWidth);
    const maxSlide = Math.max(0, totalCards - visibleCards);

    prevButton.classList.toggle("disabled", currentSlide === 0);
    nextButton.classList.toggle("disabled", currentSlide >= maxSlide);
  }

  function goToPrevSlide() {
    const viewportWidth = window.innerWidth;
    const visibleCards = Math.floor(viewportWidth / itemWidth);
    const maxSlide = Math.max(0, totalCards - visibleCards);
    if (currentSlide > 0) {
      currentSlide--;
      updateSlider();
    }
  }

  function goToNextSlide() {
    const viewportWidth = window.innerWidth;
    const visibleCards = Math.floor(viewportWidth / itemWidth);
    const maxSlide = Math.max(0, totalCards - visibleCards);
    if (currentSlide < maxSlide) {
      currentSlide++;
      updateSlider();
    }
  }

  prevButton.addEventListener("click", goToPrevSlide);
  nextButton.addEventListener("click", goToNextSlide);

  let wheelTimeout = null;
  sliderWrapper.addEventListener("wheel", (e) => {
    if (e.deltaX !== 0) {
      e.preventDefault();
      if (wheelTimeout) return;
      if (e.deltaX > 0) goToNextSlide();
      else if (e.deltaX < 0) goToPrevSlide();
      wheelTimeout = setTimeout(() => (wheelTimeout = null), 1000);
    }
  });

  updateSlider();
  window.addEventListener("resize", updateSlider);

  function updateCursorDisplay(condition) {
    const navbarRect = navbar.getBoundingClientRect();
    const isInNavbar =
      mouseX >= navbarRect.left &&
      mouseX <= navbarRect.right &&
      mouseY >= navbarRect.top &&
      mouseY <= navbarRect.bottom;
    const isOutsideHero =
      heroSection.getBoundingClientRect().top + heroSection.offsetHeight <= 0;

    follower.style.display = isInNavbar || isOutsideHero ? "none" : "block";
  }

  function animate() {
    followX += (mouseX - followX) * 0.1;
    followY += (mouseY - followY) * 0.1;

    const stiffness = 0.1;
    const damping = 0.8;
    const mass = 1;

    let accelerationInner = (targetRadiusInner - radiusInner) * stiffness;
    velocityInner = (velocityInner + accelerationInner) * damping;
    radiusInner += velocityInner;

    let accelerationOuter = (targetRadiusOuter - radiusOuter) * stiffness;
    velocityOuter = (velocityOuter + accelerationOuter) * damping;
    radiusOuter += velocityOuter;

    follower.style.left = followX + "px";
    follower.style.top = followY + "px";
    contentWrapper.style.setProperty("--x", followX + "px");
    contentWrapper.style.setProperty("--y", followY + "px");
    contentWrapper.style.setProperty("--radius-inner", radiusInner + "px");
    contentWrapper.style.setProperty("--radius-outer", radiusOuter + "px");

    requestAnimationFrame(animate);
  }

  animate();
});

// Log scroll position after full load
window.addEventListener("load", () => {
  console.log("ScrollY after full load:", window.scrollY);
});
