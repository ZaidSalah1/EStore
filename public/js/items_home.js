

// Import Firebase SDK functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyBTfykjKEJFbw4MT0VOpMuBl2vTZqN1a0E",
    authDomain: "zaid-539bb.firebaseapp.com",
    projectId: "zaid-539bb",
    storageBucket: "zaid-539bb.appspot.com",
    messagingSenderId: "493463305652",
    appId: "1:493463305652:web:b346573eb59956f7dd06e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


// Function to fetch products from Firebase
function fetchProducts() {
    const productsRef = ref(database, 'products');

    get(productsRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                all_products_json = data; // Assign the fetched data to all_products_json
                populateProducts(data); // Call to populate the products display
                ComputerDesktopProducts(data); // Assuming this function displays products on desktop
                ComputerDesktopProducts2(data); // Assuming this function displays products on desktop 2
                getRandomSearchItem(data);// *&*&*&*&
                handleSearch(data);// *&*&*&*&
                searchResultScreen(data);
            } else {
                console.log("No data available");
            }
        })
        .catch((error) => {
            console.error("Error fetching products:", error);
        });
}


function populateProducts(data) {
    const swiper_items_sale = document.getElementById('swiper_items_sale');

    // Assuming 'data' is an object where keys represent product keys
    Object.keys(data).forEach(key => {
        const product = data[key];

        // If the product has an old price, calculate the discount
        if (product.old_price) {
            const percent_disc = Math.floor((product.old_price - product.price) / product.old_price * 100);
            // console.log("Product Key (Firebase): " + key);

            // Check if the product is sold out (quantity 0, undefined, or less than 1)
            const isSoldOut = !product.quantity || product.quantity <= 0;

            // Build the product card with "Sold Out" check
            swiper_items_sale.innerHTML += `
            <div class="product swiper-slide" onclick="location.href='item.html?id=${product.id}'">
                <div class="icons">
                    ${isSoldOut ? '' : `
                        <span>
                            <i onclick="addToCart('${key}', this); event.stopPropagation();" class="fa-solid fa-cart-plus"></i>
                        </span>
                    `}
                        <span>
                        <i onclick="event.preventDefault(); event.stopPropagation(); addToFav('${key}', this);" class="fa-solid fa-heart"></i>
                    </span>        
                    <span><i class="fa-solid fa-share"></i></span>
                </div>
        
                <span class="sale_present">%${percent_disc}</span>
        
                <div class="img_product">
                    <img src="${product.img}" alt="">
                    <img class="img_hover" src="${product.img_hover}" alt="">
                </div>
        
                <h3 class="name_product">
                    <a href="item.html?id=${key}">${product.name}</a>  <!-- Pass key instead of id -->
                </h3>
        
                <div class="stars">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <span>0 Review(s)</span>
                </div>
        
                <div class="price">
                    <p><span>₪${product.price}</span></p>
                    <p class="old_price">₪${product.old_price}</p>
                </div>
        
                ${isSoldOut ? `
                    <div class="sold_out">
                        <p>Sold Out</p>
                    </div>
                ` : ''}
            </div>
        `;

        }
    });
}


function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function ComputerDesktopProducts(data) {
    const other_product_swiper = document.getElementById('other_product_swiper');

    Object.keys(data).forEach(key => {
        const product = data[key];
        const percent_disc = Math.floor((product.old_price - product.price) / product.old_price * 100);
        const isSoldOut = !product.quantity || product.quantity <= 0;

        const truncatedName = truncateText(product.name, 25); // Set max length of 25 characters


        if (!product.old_price) {
            other_product_swiper.innerHTML += `
                <div class="product swiper-slide" onclick="location.href='item.html?id=${product.id}'">
                    <div class="icons">     
                        ${isSoldOut ? '' : `
                            <span>
                                <i onclick="addToCart('${key}', this); event.stopPropagation();" class="fa-solid fa-cart-plus"></i>
                            </span>
                        `}
          <i onclick="event.preventDefault(); event.stopPropagation(); addToFav('${key}', this);" class="fa-solid fa-heart"></i>
                        <span><i class="fa-solid fa-share"></i></span>
                    </div>
                
    
                    <div class="img_product">
                        <img src="${product.img}" alt="">
                        <img class="img_hover" src="${product.img_hover}" alt="">
                    </div>
    
                    <h3 class="name_product">
                             <a href="item.html?id=${product.id}">${truncatedName}</a>  <!-- Use truncated name here -->
                    </h3>
    
                    <div class="stars">  
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <span>0 Review(s)</span>
                    </div>
        
                    <div class="price">
                        <p><span>₪${product.price}</span></p>
                    </div>

                      ${isSoldOut ? `
                        <div class="sold_out">
                            <p>Sold Out</p>
                        </div>
                    ` : ''}
                </div>
            `;
        }

    })
}

function ComputerDesktopProducts2(data) {
    const other_product_swiper2 = document.getElementById('other_product_swiper2');

    Object.keys(data).forEach(key => {
        const product = data[key];
        const percent_disc = Math.floor((product.old_price - product.price) / product.old_price * 100);
        const isSoldOut = !product.quantity || product.quantity <= 0;

        if (!product.old_price) {
            other_product_swiper2.innerHTML += `
            <div class="product swiper-slide" onclick="location.href='item.html?id=${product.id}'">
                <div class="icons">     
                  ${isSoldOut ? '' : `
                            <span>
                                <i onclick="addToCart('${key}', this); event.stopPropagation();" class="fa-solid fa-cart-plus"></i>
                            </span>
                        `}
             <i onclick="event.preventDefault(); event.stopPropagation(); addToFav('${key}', this);" class="fa-solid fa-heart"></i>
                    <span><i class="fa-solid fa-share"></i></span>
                </div>


                <div class="img_product">
                    <img src="${product.img}" alt="">
                    <img class="img_hover" src="${product.img_hover}" alt="">
                </div>

                <h3 class="name_product">
                  <a href="item.html?id=${key}">${product.name}</a>  <!-- Modified this line -->
                </h3>

                <div class="stars">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <span>0 Review(s)</span>
                </div>
    
                <div class="price">
                    <p><span>₪${product.price}</span></p>
                </div>
                      ${isSoldOut ? `
                        <div class="sold_out">
                            <p>Sold Out</p>
                        </div>
                    ` : ''}
            </div>
        `;
        }

    })
}

// Automatically fetch and display products when the page loads
fetchProducts();


// --------------------------------------------

// Product Detail database
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}


function fetchProductData() {
    const productId = getProductIdFromUrl(); // Get the product ID from URL
    const productsRef = ref(database, 'products'); // Reference to the products in the database

    get(productsRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                // const product = data.find(item => item.id == productId); // Find the product by ID
                const product = Object.values(data).find(item => item.id == productId);


                if (product) {
                    // Populate the product data in the UI
                    const bigImg = document.querySelector('.big_img img');
                    const smImgsContainer = document.querySelector('.sm_imgs');
                    const nameElement = document.querySelector('.details_item .name');
                    // const stars = document.querySelector('.stars');
                    const priceElement = document.querySelector('.price span');
                    const oldPriceElement = document.querySelector('.old_price');
                    const description = document.querySelector('.item_decription');
                    const availabilityElement = document.querySelector('.availability');
                    const quantity = document.querySelector('.count');

                    // Set product details
                    bigImg.src = product.img; // Set big image
                    nameElement.innerText = product.name; // Set product name
                    priceElement.innerText = `₪${product.price}`; // Set price


                    // Set old price
                    if (product.old_price) {
                        oldPriceElement.innerText = `₪${product.old_price}`;
                    } else {
                        oldPriceElement.style.display = 'none';
                    }



                    description.innerText = product.description || 'No description available'; // Set description

                    availabilityElement.innerText = "In Stock";

                    if (product.quantity == 0 || product.quantity == undefined) {
                        availabilityElement.innerText = "Not available";
                        availabilityElement.style.color = "red";
                    }

                    quantity.innerHTML = "Only " + product.quantity + " left in Stock";

                    // // Clear previous small images
                    smImgsContainer.innerHTML = '';

                    // Set small images
                    product.images.forEach((image, index) => {
                        const smImg = document.createElement('img');
                        smImg.src = image;
                        smImg.alt = `Product image ${index + 1}`;
                        smImg.onclick = () => changeItemImage(smImg.src); // Add the event listener here
                        smImgsContainer.appendChild(smImg);
                    });


                    // Select elements using the correct CSS selector syntax

                    const addToFav = document.querySelector('.add_fav');

                    // Create the button element

                    //
                    const addToCartBtn = document.createElement('button');
                    addToCartBtn.innerHTML = `Add To Cart <i class="fa-solid fa-cart-shopping"></i>`;

                    const addToFavv = document.createElement('favIcon');
                    addToFavv.innerHTML = `<span><i class="fa-regular fa-heart"></i></span>`;

                    // Append the button to the add_fav div
                    addToFav.appendChild(addToCartBtn);
                    addToFav.appendChild(addToFavv);
                    addToCartBtn.addEventListener('click', () => {

                        addToCart(productId, addToCartBtn);
                    });



                    // Set stars (assuming 5 stars max)
                    // stars.innerHTML = '';
                    // for (let i = 0; i < 5; i++) {
                    //     const star = document.createElement('i');
                    //     star.className = 'fa-solid fa-star';
                    //     stars.appendChild(star);
                    // }



                } else {
                    document.querySelector('.details_item').innerText = 'Product not found';
                }
            } else {
                console.log("No data available");
            }
        })
        .catch((error) => {
            // console.error("Error fetching product data:", error);
        });
}

// Call the function to fetch and display product data when the page loads
fetchProductData();

// --------------------------------------------


function getRandomSearchItem(data) {
    const searchDropdown = document.querySelector('.searchDropdown');
    const allProducts = Object.keys(data).map(key => data[key]); // Convert object into array of products

    // Shuffle the array of products
    const shuffledProducts = allProducts.sort(() => 0.5 - Math.random());

    // Get the first 7 items from the shuffled array
    const randomProducts = shuffledProducts.slice(0, 7);

    // Clear previous items
    searchDropdown.innerHTML = '';

    // Display the randomly selected items
    randomProducts.forEach(product => {
        searchDropdown.innerHTML += `
        <a href="item.html?id=${product.id}" class="searchItem">
            <img src="${product.img}" alt="">
            <div class="name_price">
                <p class="name">${product.name}</p>
                <div class="price">
                    <p class="search_price">₪${product.price}</p>
                    ${product.old_price ? `<p class="old_price">₪${product.old_price}</p>` : ''}
                </div>
            </div> 
        </a>
        `;

    });
}

// Function to handle the search and display matching results
function handleSearch(data) {
    const searchInput = document.querySelector('.search input');
    const searchDropdown = document.querySelector('.searchDropdown');

    // Listen for input changes in the search field
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase(); // Get the user's search query and convert to lowercase
        searchDropdown.innerHTML = ''; // Clear the previous search results

        // Filter the products based on the search query
        const filteredProducts = Object.keys(data).map(key => data[key]).filter(product =>
            product.name.toLowerCase().includes(query) // Check if the product name contains the query
        );

        // Display only the products that match the search query
        filteredProducts.forEach(product => {


            searchDropdown.innerHTML += `
            <a href="item.html?id=${product.id}" class="searchItem">
                <img src="${product.img}" alt="">
                <div class="name_price">
                    <p class="name">${product.name}</p>
                    <div class="price">
                        <p class="search_price">₪${product.price}</p>
                        ${product.old_price ? `<p class="old_price">₪${product.old_price}</p>` : ''}
                    </div>
                </div> 
            </a>
            `;
        });

        // If no matches, you can optionally display a "No results found" message
        if (filteredProducts.length === 0) {
            searchDropdown.innerHTML = `
                <div class="noResult">
                        <p>No Result Found </p>
                    </div>
                    `;
        }
    });
}

// function searchScreen() {
//     // Get the value of the input field
//     const searchInput = document.getElementById('searchInput').value;

//     // Store the input value in localStorage
//     localStorage.setItem('searchInput', searchInput);

//     // Redirect to the search results page
//     window.location.href = 'search_results.html';
// }


// Function to display search results
async function searchResultScreen() {
    const searchInput = localStorage.getItem('searchInput');
    const test = document.getElementById('test');
    const product_div = document.getElementById('products_search');

    // Check if the products_search element exists
    if (!product_div) {
        // console.error("Element with ID 'products_search' not found.");
        return;
    }

    if (searchInput) {
        const query = searchInput.toLowerCase();
        // Fetch data from Firebase
        const dbRef = ref(database, 'products'); // Replace 'products' with your Firebase path
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const filteredProducts = Object.keys(data).map(key => data[key]).filter(product =>
                product.name.toLowerCase().includes(query) // Check if the product name contains the query
            );

            // Display filtered products
            if (filteredProducts.length > 0) {
                product_div.innerHTML = ""; // Clear previous results
                filteredProducts.forEach(product => {
                    product_div.innerHTML += `
                    <div class="product">
                        <div class="icons">     
                            <span><i class="fa-solid fa-cart-plus"></i></span>
                            <span><i class="fa-solid fa-heart"></i></span>
                            <span><i class="fa-solid fa-share"></i></span>
                        </div>
    
                        <div class="img_product">
                            <img src="${product.img}" alt="">
                            <img class="img_hover" src="${product.img_hover}" alt="">
                        </div>
    
                        <h3 class="name_product">
                            <a href="item.html?id=${product.id}">${product.name}</a>
                        </h3>
    
                        <div class="stars">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>
                    </div>
                    `;
                });
            } else {
                test.textContent = 'No matching products found.';
            }
        } else {
            test.textContent = 'No data available in Firebase.';
        }
    } else {
        test.textContent = 'No search input found.';
    }
}

// Call the searchResultScreen function only on the search results page
if (window.location.pathname.includes("search_results.html")) {
    window.addEventListener("load", searchResultScreen);
}