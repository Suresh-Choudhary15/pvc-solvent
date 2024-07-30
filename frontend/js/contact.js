document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const feedback = document.getElementById("feedback");

  if (!name || !email || !message) {
    feedback.textContent = "Please fill in all fields";
    feedback.style.color = "red";
    return;
  }

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (response.ok) {
      feedback.textContent = "Message sent successfully";
      feedback.style.color = "green";
      document.getElementById("contactForm").reset();
    } else {
      feedback.textContent = "Failed to send message";
      feedback.style.color = "red";
    }
  } catch (error) {
    feedback.textContent = "Failed to send message";
    feedback.style.color = "red";
  }
});
