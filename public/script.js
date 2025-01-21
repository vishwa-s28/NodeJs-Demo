document.getElementById("fetchUsers").addEventListener("click", fetchUsers);

const userDiv = document.getElementById("users");
const userDetailsDiv = document.getElementById("userDetails");

async function fetchUsers() {
  userDiv.innerHTML = "<p>Loading users...</p>";
  userDetailsDiv.innerHTML = "";

  try {
    const response = await fetch("http://localhost:3001/users");
    const users = await response.json();

    userDiv.innerHTML = "<h2>Users:</h2>";
    users.forEach((user) => {
      const userElement = document.createElement("div");
      userElement.className = "user";
      userElement.innerText = `${user.email}`;
      userElement.onclick = () => fetchUserDetails(user._id);

      userDiv.appendChild(userElement);
    });
  } catch (error) {
    userDiv.innerHTML = `<p>Error fetching users: ${error.message}</p>`;
  }
}

async function fetchUserDetails(userId) {
  userDetailsDiv.innerHTML = "<p>Loading user details...</p>";

  try {
    const userResponse = await fetch(`http://localhost:3001/users/${userId}`);
    const user = await userResponse.json();

    let total_quantity = 0;
    if (user.cart && user.cart.items) {
      total_quantity = user.cart.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
    }

    userDetailsDiv.innerHTML = `
      <h2>User Details:</h2>
      <p>Email: ${user.email}</p>
      <p>Total Items in Cart: ${total_quantity}</p>
      <button id="orderDetailsBtn">Show Order Details</button>
      <div id="orderDetails" style="display: none;">
    <p>Loading order details...</p>
  </div>
`;

    document
      .getElementById("orderDetailsBtn")
      .addEventListener("click", async function () {
        const orderDetailsDiv = document.getElementById("orderDetails");

        if (orderDetailsDiv.style.display === "none") {
          try {
            const ordersResponse = await fetch(
              `http://localhost:3002/orders/${userId}`
            );
            const ordersData = await ordersResponse.json();

            if (ordersData.product_data.length > 0) {
              orderDetailsDiv.innerHTML = "<h3>Order Details:</h3>";
              ordersData.product_data.forEach((item) => {
                const product = item.product;
                const quantity = item.quantity;

                orderDetailsDiv.innerHTML += `
            <div class="order-item">
              <p>Product Name: ${product.title}</p>
              <p>Price: $${product.price}</p>
              <p>Quantity: ${quantity}</p>
            </div>
            <hr />
          `;
              });
            } else {
              orderDetailsDiv.innerHTML =
                "<p>No orders found for this user.</p>";
            }

            orderDetailsDiv.style.display = "block";
          } catch (error) {
            orderDetailsDiv.innerHTML = `<p>Error fetching order details: ${error.message}</p>`;
          }
        } else {
          orderDetailsDiv.style.display = "none";
        }
      });
  } catch (error) {
    userDetailsDiv.innerHTML = `<p>Error fetching details: ${error.message}</p>`;
  }
}
