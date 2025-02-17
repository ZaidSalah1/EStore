var cart = document.querySelector('.cart');

function open_cart() {
    cart.classList.add("active");
}

function close_cart() {
    cart.classList.remove("active");
}



let products_cart = [];

function addToCart(id, btn) {
    const productId = Number(id); // Convert id to a number
    const product = all_products_json.find(item => item.id === productId);

    if (product) {
        let existingProduct = products_cart.find(item => item.id === productId);
        if (existingProduct) {
            existingProduct.count += 1;
        } else {
            product.count = 1;
            products_cart.push(product);
        }
        localStorage.setItem("cartItems", JSON.stringify(products_cart));
        getCartItems();
    } else {
        console.error("Product not found with ID:", productId);
    }
}


// Function to get cart items and update the cart display
function getCartItems() {
    const items_in_cart = document.querySelector(".items_in_cart");
    const price_cart_head = document.querySelector(".price_cart_head");
    const price_cart_total = document.querySelector(".price_cart_total");
    const count_item = document.querySelector(".count_item");
    const top_items_count = document.querySelector(".top_items_count");

    let items_c = "";
    let total_price = 0;
    let count = 0;

    // Loop through products in cart
    products_cart.forEach((item, index) => {
        if (!item.hasOwnProperty('count')) {
            item.count = 1;  // Initialize count to 1 if it doesn't exist
        }

        const itemTotalPrice = item.price * item.count;
        items_c += `
            <div class="item_cart">
                <img src="${item.images[0]}" alt="">  <!-- Access first image -->
                <div class="content">
                    <h4>${item.name}</h4>
                    <div class="counter_Price">
                        <p class="price">₪${itemTotalPrice}</p>
                        <div class="counter">
                            <div class="pluse" onclick="changeQuantity(${index}, 1)"> + </div>
                            <div class="counter_value">${item.count}</div>
                            <div class="minus" onclick="changeQuantity(${index}, -1)"> - </div>
                        </div>
                    </div>
                </div>
                <button onclick="remove_from_cart(${index})" class="delete_item">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;

        count += item.count;  // Update item count
        total_price += itemTotalPrice;  // Update total price
    });

    // Update the cart display
    items_in_cart.innerHTML = items_c;
    price_cart_head.innerHTML = "₪" + total_price;
    price_cart_total.innerHTML = "₪" + total_price;
    count_item.innerHTML = count;
    top_items_count.innerHTML = `(${count} Items in Cart)`;
}

document.addEventListener("DOMContentLoaded", function () {
    const storedCart = JSON.parse(localStorage.getItem("cartItems"));
    if (storedCart) {
        products_cart = storedCart;
        getCartItems();
    }
});



let favorites = [];

// Add/remove product from favorites
function addToFav(id, icon) {
    const product = all_products_json.find(item => item.id === Number(id)); // Convert id to number
    if (!product) {
        console.error("Product not found with ID:", id);
        return;
    }

    const index = favorites.findIndex(item => item.id === Number(id));
    if (index === -1) {
        favorites.push(product);
        icon.classList.add("active"); // Add active class
    } else {
        favorites.splice(index, 1);
        icon.classList.remove("active"); // Remove active class
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavCount();
}

// Update favorites count in the UI
const favCountElement = document.querySelector(".count_fav");
function updateFavCount() {
    const favCountElement = document.querySelector(".count_fav");
    console.log("favCountElement------------------>", favCountElement)
    if (favCountElement) {
        favCountElement.textContent = favorites.length;
    }
}

// Initialize favorites from localStorage
function initializeFavorites() {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites"));
    if (storedFavorites) {
        favorites = storedFavorites;
        console.log("fav count ->", favorites.length);
        favCountElement.textContent = favorites.length;
        updateFavCount();
    }
}

// Call initializeFavorites when the page loads
document.addEventListener("DOMContentLoaded", initializeFavorites);

// Open favorites page
function openFavPage() {
    console.log("Favorites:", favorites);
    // Example: Redirect to a favorites page
    // window.location.href = "/favorites";
}



// Function to change item quantity
function changeQuantity(index, change) {
    const item = products_cart[index];
    item.count += change;
    if (item.count <= 0) item.count = 1;  // Ensure count is always positive
    localStorage.setItem("cartItems", JSON.stringify(products_cart));
    getCartItems();
}

// Function to remove an item from the cart
function remove_from_cart(index) {
    products_cart.splice(index, 1);  // Remove item from cart array
    localStorage.setItem("cartItems", JSON.stringify(products_cart));  // Update localStorage
    getCartItems();  // Update the cart display
}


function remove_from_cart_checkout(index) {
    products_cart.splice(index, 1);  // Remove item from cart array
    localStorage.setItem("cartItems", JSON.stringify(products_cart));  // Update localStorage
    location.reload(); // Reload the page to reflect the changes
}