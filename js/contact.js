document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default form submission

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    // Simple validation
    if (!name || !email || !message) {
      alert("Please fill in all required fields (Name, Email, Message).");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Placeholder for form submission (e.g., API call)
    console.log("Form submitted:", { name, email, phone, message });
    alert("Thank you for your message! We’ll get back to you soon.");

    // Reset form
    contactForm.reset();
  });
});
