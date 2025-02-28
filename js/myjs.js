document.addEventListener("DOMContentLoaded", () => {
  const follower = document.querySelector(".cursor-follower");
  const contentWrapper = document.querySelector(".content-wrapper");
  const snapSection = document.querySelector(".snap-section");
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
  let hasSnappedDown = false;
  let lastScrollPosition = 0;
  let currentSlide = 0;
  const totalCards = 13; // Total number of slider items
  const itemWidth = 250; // Fixed width of each slider item in pixels (from your CSS)

  // Set initial navbar state (visible at top)
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

  // Scroll handler with debouncing
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const snapSectionTop = snapSection.getBoundingClientRect().top;
      const heroSectionTop = heroSection.getBoundingClientRect().top;
      const heroSectionBottom = heroSectionTop + heroSection.offsetHeight;
      const scrollPosition = window.scrollY;
      const scrollingUp = scrollPosition < lastScrollPosition;

      if (scrollPosition === 0) {
        hasSnappedDown = false;
        document.body.style.scrollSnapType = "y mandatory";
      }

      if (
        !hasSnappedDown &&
        scrollPosition > 0 &&
        snapSectionTop <= window.innerHeight
      ) {
        window.scrollTo({
          top: snapSection.offsetTop,
          behavior: "smooth",
        });
        hasSnappedDown = true;
      }

      if (
        hasSnappedDown &&
        !scrollingUp &&
        scrollPosition >= snapSection.offsetTop
      ) {
        document.body.style.scrollSnapType = "none";
      }

      const isHeroVisible = heroSectionBottom > 0;
      navbar.classList.toggle("white-bg", !isHeroVisible);

      const isAtTop = scrollPosition === 0;
      const isInSnapSection =
        snapSectionTop <= 0 && snapSectionTop + snapSection.offsetHeight > 0;
      navbar.classList.toggle("visible", isAtTop || isInSnapSection);

      const isOutsideHero = heroSectionTop + heroSection.offsetHeight <= 0;
      updateCursorDisplay(isOutsideHero);

      lastScrollPosition = scrollPosition;
    }, 50);
  });

  // Slider navigation
  function updateSlider() {
    const cardWidth = itemWidth; // Use fixed item width (250px)
    const translateX = -currentSlide * cardWidth;
    sliderWrapper.style.transform = `translateX(${translateX}px)`;

    // Set slider-wrapper width based on total cards
    sliderWrapper.style.width = `${totalCards * cardWidth}px`;

    // Dynamically calculate visible cards and maxSlide
    const viewportWidth = window.innerWidth;
    const visibleCards = Math.floor(viewportWidth / cardWidth);
    const maxSlide = Math.max(0, totalCards - visibleCards);

    prevButton.classList.toggle("disabled", currentSlide === 0);
    nextButton.classList.toggle("disabled", currentSlide >= maxSlide);
  }

  // Button click handlers
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

  // Wheel event with debounce, only for horizontal scroll
  let wheelTimeout = null;
  sliderWrapper.addEventListener("wheel", (e) => {
    if (e.deltaX !== 0) {
      e.preventDefault();

      if (wheelTimeout) return;

      if (e.deltaX > 0) {
        goToNextSlide(); // Swipe left
      } else if (e.deltaX < 0) {
        goToPrevSlide(); // Swipe right
      }

      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
      }, 1000);
    }
  });

  // Initial slider setup and resize handler
  updateSlider();
  window.addEventListener("resize", updateSlider); // Update on resize

  // Function to update cursor-follower display
  function updateCursorDisplay(condition) {
    const navbarRect = navbar.getBoundingClientRect();
    const isInNavbar =
      mouseX >= navbarRect.left &&
      mouseX <= navbarRect.right &&
      mouseY >= navbarRect.top &&
      mouseY <= navbarRect.bottom;
    const isOutsideHero =
      heroSection.getBoundingClientRect().top + heroSection.offsetHeight <= 0;

    if (isInNavbar || isOutsideHero) {
      follower.style.display = "none";
    } else {
      follower.style.display = "block";
    }
  }

  // Animation loop
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
