// Open & close Cart
var cart = document.querySelector('.cart');

function open_cart(){
    cart.classList.add("active");
}

function close_cart(){
    cart.classList.remove("active");
}


// Open & close menu
var menu = document.querySelector('#menu');

function open_menu(){
    menu.classList.add("active");
}

function close_menu(){
    menu.classList.remove("active");
}

//Change Item image
let bigImage = document.querySelector("#bigImg");

function changeItemImage(img){
   // console.log("Image clicked:", img); // Check if this runs
    bigImage.src = img;
}


// Add Item in Cart

var all_products_json;

var items_in_cart = document.querySelector(".items_in_cart");
let product_cart =[];


function addToCart(id, btn){
    // console.log(all_products_json[id]);
    product_cart.push(all_products_json[id]);
    btn.classList.add("active");

    localStorage.setItem("cartItems", JSON.stringify(product_cart))

    
    getCartItems();
}



let count_fav_item = document.querySelector(".count_fav");
let product_fav = JSON.parse(localStorage.getItem("favItems")); // Array to store favorite products


function addToFav(id, btn){
    const product = all_products_json[id];
    
    if(!product_fav.some(fav => fav.id === id)){
        product_fav.push(product);
        btn.classList.add("active"); 
        // console.log(`Added to Fav : ${product.name}`);
    }

    localStorage.setItem("favItems", JSON.stringify(product_fav));
    displayFavorites();
}

function displayFavorites() {
    const favItem = JSON.parse(localStorage.getItem("favItems")) || [];
    const countFavItem = document.querySelector(".count_fav");

    if (countFavItem) {
        let count = 0;
        favItem.forEach(item => {
            if (!item.hasOwnProperty('count')) {
                item.count = 1;
            }
            count += item.count;
        });

        countFavItem.innerHTML = count;
        console.log("Total favorite items count: " + count);
    }
}

displayFavorites();

function loadFavorites() {
    const favItems = JSON.parse(localStorage.getItem("favItems")) || [];
    const favContainer = document.getElementById("fav_products");

    if (favItems.length === 0) {
        favContainer.innerHTML = "<p>No favorite items found.</p>";
        return;
    }

    let favHTML = "";
    favItems.forEach(item => {

        const hasDiscount = item.old_price;
        
        favHTML += `
          <div class="product" >
            <img src="${item.img}">

            <h3 class="name_product">
                <a href="">${item.name}</a>
            </h3>
             <div class="price">
                    <p><span>₪${item.price}</span></p>
                    ${hasDiscount ? `
                        <p class="old_price">₪${item.old_price}</p>`
                        : ''
                    }
                   
                </div>
            <div class="addToCart_btn">
                <p><i class="fa-solid fa-cart-shopping"><span>Add To Cart</span></i></p>
            </div>

            <div class="fav_icon" >
                <i class="fa-solid fa-heart"></i>
            </div>

        </div>
        `;
    });
    
    favContainer.innerHTML = favHTML;

    const favIcons = document.querySelectorAll(".fav_icon");
    favIcons.forEach((icon, index) => {
        icon.addEventListener('click', () => {
            removeFromFav(index);
        })
    });

}

// Load favorites when the page loads
document.addEventListener("DOMContentLoaded", function () {
    // Check if the current page is fav.html
    if (window.location.pathname.includes("fav.html")) {
        loadFavorites();
    }
});


function removeFromFav(index){
    let favItems = JSON.parse(localStorage.getItem("favItems")) || [];

    favItems.splice(index, 1);

    localStorage.setItem("favItems", JSON.stringify(favItems));
    loadFavorites();
    displayFavorites();
}



// let count_item = document.querySelector(".count_item");
// let price_cart_head = document.querySelector(".price_cart_head");
// let price_cart_total = document.querySelector(".price_cart_total");
// let top_items_count = document.querySelector(".top_items_count");



// Function to display the cart items
function getCartItems() {
    const items_in_cart = document.querySelector(".items_in_cart");
    const price_cart_head = document.querySelector(".price_cart_head");
    const price_cart_total = document.querySelector(".price_cart_total");
    const count_item = document.querySelector(".count_item");
    const top_items_count = document.querySelector(".top_items_count");


    let items_c = "";
    let total_price = 0;
    let count = 0;
    for (let index = 0; index < product_cart.length; index++) {
        // Check if quantity exists, if not, initialize it to 1
        if (!product_cart[index].hasOwnProperty('count')) {
            product_cart[index].count = 1; // Default quantity is 1
        }

        const item = product_cart[index]; // Accessing the product

        // Calculate the total price for the item based on quantity
        const itemTotalPrice = item.price * item.count;

        // Build the HTML for each cart item
        items_c += `
            <div class="item_cart">
                <img src="${item.img}" alt="">
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

        count += item.count; // Increment the total count by item quantity
        total_price += itemTotalPrice; // Add the total price of the item to the total cart price
    }

    // Update the cart display
    items_in_cart.innerHTML = items_c;
    price_cart_head.innerHTML = "₪" + total_price;
    price_cart_total.innerHTML = "₪" + total_price;
    count_item.innerHTML = count;
    top_items_count.innerHTML = "(" + count + " Items in Cart)";
}


// function changeQuantity(index, delta) {
//     // Update the quantity of the item (ensure it doesn't go below 1)
//     product_cart[index].count = Math.max(1, product_cart[index].count + delta);

//     // Update local storage with the new cart
//     localStorage.setItem('cartItems', JSON.stringify(product_cart));

//     // Refresh the cart display
//     getCartItems();
// }


function changeQuantity(index, delta) {
    const product = product_cart[index];
    const newQuantity = product.count + delta;
    
    if(newQuantity >= 1 && newQuantity <= product.quantity){
        product_cart[index].count = newQuantity;
        localStorage.setItem('cartItems', JSON.stringify(product_cart));
    }else{
        alert(`You cannot order more than ${product.stock} items for this product.`);
    }
    
    getCartItems();
}

function remove_from_cart(index){
    product_cart.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(product_cart))
    getCartItems();

    let addToCartButtons = document.querySelectorAll(".fa-cart-plus");
    for (let index = 0; index < addToCartButtons.length; index++) {
        addToCartButtons[index].classList.remove("active");
        product_cart.forEach(product =>{
            if(product.id == index){
                addToCartButtons[index].classList.add("active");
            }
        })
        
    }
}




// Back to top
let back_to_top = document.querySelector(".back_to_top");
back_to_top.addEventListener("click", function(){
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    })
});




// Function to initialize header-related JavaScript
function initializeHeader() {
    // Open & close Cart
    var cart = document.querySelector('.cart');

    function open_cart() {
        cart.classList.add("active");
    }

    function close_cart() {
        cart.classList.remove("active");
    }

    // Open & close menu
    var menu = document.querySelector('#menu');

    function open_menu() {
        menu.classList.add("active");
    }

    function close_menu() {
        menu.classList.remove("active");
    }

    // Add event listeners for cart and menu buttons
    const iconCart = document.querySelector('.icon_cart');
    const closeCart = document.querySelector('.close_cart');
    const btnOpenMenu = document.querySelector('.btn_open_menu');
    const btnCloseMenu = document.querySelector('.btn_close_menu');

    if (iconCart) {
        iconCart.addEventListener('click', open_cart);
    }
    if (closeCart) {
        closeCart.addEventListener('click', close_cart);
    }
    if (btnOpenMenu) {
        btnOpenMenu.addEventListener('click', open_menu);
    }
    if (btnCloseMenu) {
        btnCloseMenu.addEventListener('click', close_menu);
    }

    // Search dropdown functionality
    const searchInput = document.querySelector('.search input');
    const searchDropdown = document.querySelector('.searchDropdown');

    if (searchInput && searchDropdown) {
        searchInput.addEventListener('focus', () => {
            searchDropdown.style.display = 'flex';
        });

        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                searchDropdown.style.display = 'none';
            }, 100);
        });
    }

    // Search form submission
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the default form submission behavior

            // Get the search input value
            const searchInput = document.getElementById('searchInput').value;

            // Store the search input in localStorage
            localStorage.setItem('searchInput', searchInput);

            // Redirect to the search results page
            window.location.href = 'search_results.html';
        });
    }

    // Initialize cart and favorites
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
        product_cart = JSON.parse(storedCart);
        getCartItems();
    }

    displayFavorites();
}

// Call initializeHeader when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // If the header is already loaded (e.g., not dynamically loaded), initialize the header
    if (document.querySelector('.cart')) {
        initializeHeader();
    }
});