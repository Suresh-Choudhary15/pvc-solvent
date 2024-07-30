document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get("id");

  if (!itemId) {
    window.location.href = "products.html";
    return;
  }

  fetch(`/api/items/${itemId}`)
    .then((response) => response.json())
    .then((item) => {
      document.getElementById("itemName").textContent = item.name;
      document.getElementById("itemDescription").textContent = item.description;
      document.getElementById(
        "itemQuantity"
      ).textContent = `Quantity: ${item.quantity} liters`;
      document.getElementById(
        "itemPrice"
      ).textContent = `Price: $${item.price.toFixed(2)}`;
    });

  fetch(`/api/comments/${itemId}`)
    .then((response) => response.json())
    .then((comments) => {
      const commentsContainer = document.getElementById("commentsContainer");
      commentsContainer.innerHTML = comments
        .map(
          (comment) => `
          <div class="comment">
            <p>${comment.content}</p>
            <p>Rating: ${comment.rating}/5</p>
          </div>
        `
        )
        .join("");
    });

  document
    .getElementById("commentForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const content = document.getElementById("commentContent").value;
      const rating = document.getElementById("commentRating").value;
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!content || !rating) {
        alert("Please fill in all fields");
        return;
      }

      try {
        const response = await fetch("/api/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ itemId, content, rating }),
        });

        const data = await response.json();
        if (response.ok) {
          location.reload();
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Failed to add comment");
      }
    });
});
