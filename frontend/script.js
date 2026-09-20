// Add product to cart
function addToCart(name, price) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const product = {
        name: name,
        price: price
    };

    cart.push(product);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(name + " added to cart!");
}


// Display cart items
function displayCart() {

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItems) {
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.textContent = "0";
        return;
    }

    cart.forEach((product, index) => {

        total += product.price;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <h3>${product.name}</h3>
                    <p>₹${product.price}</p>
                </div>

                <button onclick="removeFromCart(${index})">
                    Remove
                </button>
            </div>
        `;
    });

    cartTotal.textContent = total;
}


// Remove product from cart
function removeFromCart(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}


// Place order
async function placeOrder() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Please login before placing an order.");
        window.location.href = "login.html";
        return;
    }

    const totalAmount = cart.reduce((total, product) => {
        return total + product.price;
    }, 0);

    try {
        const response = await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userEmail: user.email,
                products: cart,
                totalAmount: totalAmount
            })
        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {
            localStorage.removeItem("cart");
            displayCart();
        }

    } catch (error) {
        console.log("Order error:", error);
        alert("Failed to place order.");
    }
}


// Display cart when cart page opens
displayCart();
// Registration
const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        const response = await fetch("http://localhost:5000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {
            window.location.href = "login.html";
        }
    });
}


// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = "index.html";
        }
    });
}