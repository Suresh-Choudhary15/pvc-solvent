document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/items")
    .then((response) => response.json())
    .then((items) => {
      const productGrid = document.querySelector(".product-grid");
      productGrid.innerHTML = items
        .map(
          (item) => `
          <div class="item-card">
            <h3>${item.name}</h3>
            <p class="item-quantity">Quantity: ${item.quantity} liters</p>
            <p class="item-price">$${item.price.toFixed(2)}</p>
            <p class="item-description">${item.description}</p>
            <button class="btn-order" onclick="redirectToLogin()">Order</button>
          </div>
        `
        )
        .join("");
    });
});

function redirectToLogin() {
  window.location.href = "login.html";
}
