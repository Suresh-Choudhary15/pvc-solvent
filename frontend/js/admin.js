document.addEventListener("DOMContentLoaded", async () => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const feedback = document.getElementById("feedback");

  function displayFeedback(message, isError = false) {
    feedback.textContent = message;
    feedback.style.color = isError ? "red" : "green";
    setTimeout(() => {
      feedback.textContent = "";
    }, 3000);
  }

  async function fetchItems() {
    const response = await fetch("/api/items", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      window.location.href = "login.html";
      return;
    }

    const items = await response.json();
    const dashboardContent = document.getElementById("dashboardContent");
    dashboardContent.innerHTML = `
      <h2>Items</h2>
      <ul>
        ${items
          .map(
            (item) => `
          <li>
            ${item.name} - $${item.price.toFixed(2)}
            <button onclick="deleteItem('${item._id}')">Delete</button>
            <button onclick="editItem('${item._id}')">Edit</button>
          </li>
        `
          )
          .join("")}
      </ul>
    `;
  }

  async function deleteItem(itemId) {
    const response = await fetch(`/api/items/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    if (response.ok) {
      displayFeedback(result.message);
      fetchItems();
    } else {
      displayFeedback(result.message, true);
    }
  }

  async function editItem(itemId) {
    const item = await fetch(`/api/items/${itemId}`).then((res) => res.json());
    document.getElementById("name").value = item.name;
    document.getElementById("quantity").value = item.quantity;
    document.getElementById("price").value = item.price;
    document.getElementById("description").value = item.description;
    document.getElementById("createItemForm").onsubmit = async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const quantity = parseInt(document.getElementById("quantity").value);
      const price = parseFloat(document.getElementById("price").value);
      const description = document.getElementById("description").value.trim();

      if (!name || quantity <= 0 || price <= 0 || !description) {
        displayFeedback("Please fill in all fields correctly.", true);
        return;
      }

      const response = await fetch(`/api/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, quantity, price, description }),
      });
      const result = await response.json();
      if (response.ok) {
        displayFeedback(result.message);
        document.getElementById("createItemForm").reset();
        document.getElementById("createItemForm").onsubmit = createItem;
        fetchItems();
      } else {
        displayFeedback(result.message, true);
      }
    };
  }

  async function createItem(e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const quantity = parseInt(document.getElementById("quantity").value);
    const price = parseFloat(document.getElementById("price").value);
    const description = document.getElementById("description").value.trim();

    if (!name || quantity <= 0 || price <= 0 || !description) {
      displayFeedback("Please fill in all fields correctly.", true);
      return;
    }

    const response = await fetch("/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, quantity, price, description }),
    });
    const result = await response.json();
    if (response.ok) {
      displayFeedback(result.message);
      document.getElementById("createItemForm").reset();
      fetchItems();
    } else {
      displayFeedback(result.message, true);
    }
  }

  document.getElementById("createItemForm").onsubmit = createItem;
  fetchItems();
});
