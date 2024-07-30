document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/items")
    .then((response) => response.json())
    .then((items) => {
      const productGrid = document.getElementById("productGrid");
      productGrid.innerHTML = items
        .map(
          (item) => `
          <div class="item-card">
            <h3>${item.name}</h3>
            <p class="item-quantity">Quantity: ${item.quantity} liters</p>
            <p class="item-price">$${item.price.toFixed(2)}</p>
            <p class="item-description">${item.description}</p>
            <a href="item.html?id=${
              item._id
            }" class="btn-primary">View Details</a>
          </div>
        `
        )
        .join("");
    });
});
