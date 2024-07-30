document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      document.cookie = `token=${data.token}; path=/; HttpOnly`;
      window.location.href = "admin.html";
    } else {
      document.getElementById("error").textContent = data.message;
    }
  } catch (error) {
    document.getElementById("error").textContent = "Login failed";
  }
});
