// const { response, json } = require("express");


var all_products_json = null;

// Fetch products once when the page loads
fetch('/products')
    .then(response => response.json())
    .then(data => {
        all_products_json = data;
        console.log("-------> Fetched Products:", all_products_json);
    })
    .catch(error => {
        console.error('Error fetching products:', error);
    });

// Function to display random products in the dropdown
function getRandomSearchItem() {
    if (!all_products_json) {
        console.warn("Products data is not loaded yet!");
        return;
    }

    const searchDropdown = document.querySelector('.searchDropdown');
    if (!searchDropdown) return console.error("searchDropdown element not found!");

    const allProducts = Object.values(all_products_json); // Convert object into array of products

    // Fisher-Yates shuffle for better randomness
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }
    shuffleArray(allProducts);

    // Get the first 7 items from the shuffled array
    const randomProducts = allProducts.slice(0, 7);

    // Clear previous items
    searchDropdown.innerHTML = '';

    // Display the randomly selected items
    randomProducts.forEach(product => {

        const images = product.images || [];
        let img1 = images[0] || 'default.jpg'; // Use the first image or a default
        // let img2 = images[1] || img1; // Use the second image or fallback to the first

        // Ensure the image paths are valid         ///uploads/
        img1 = img1.startsWith("http") ? img1 : `${img1}`; // Use `/uploads/` for local images
        // img2 = img2.startsWith("http") ? img2 : `${img2}`; // Use `/uploads/` for local images

        searchDropdown.innerHTML += `
            <a href="item.html?id=${product.id}" class="searchItem">
                <img src="${img1 || '../img/default.jpg'}" alt="${product.name}">
                <div class="name_price">
                    <p class="name">${product.name}</p>
                    <div class="price">
                        <p class="search_price">₪${product.price}</p>
                        ${product.discount && product.discount > product.price ? `<p class="old_price">₪${product.discount}</p>` : ''}
                    </div>
                </div>  
            </a>
        `;
    });

    // Show the dropdown (optional)
    searchDropdown.style.display = "block";
}

function searchItem() {
    const searchInput = document.getElementById('searchInput');
    const searchDropdown = document.querySelector('.searchDropdown');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        searchDropdown.innerHTML = ''; // Clear previous search results

        const filteredProducts = Object.keys(all_products_json)
            .map(key => all_products_json[key])
            .filter(product => {
                return product.name.toLowerCase().includes(query);
            });

        if (filteredProducts.length === 0) {
            // Display "No results found" message if no matches
            searchDropdown.innerHTML = `
            <div class="noResult">
                <i class="fas fa-search"></i> <!-- Font Awesome search icon -->
                <p>No Result Found</p>
            </div>
        `;
        } else {

            localStorage.setItem('searchInput', query);

            // Display filtered products
            filteredProducts.forEach(product => {
                const images = product.images || [];
                let img1 = images[0] || 'default.jpg';

                // Ensure the image path is valid
                img1 = img1.startsWith("https") ? img1 : `${img1}`;

                // Create a container for the search item
                const searchItem = document.createElement('a');
                searchItem.href = `item.html?id=${product.id}`;
                searchItem.className = 'searchItem';

                // Add a placeholder image or loading spinner
                searchItem.innerHTML = `
                    <img src="../img/placeholder.jpg" data-src="${img1 || '../img/default.jpg'}" alt="${product.name}" loading="lazy">
                    <div class="name_price">
                        <p class="name">${product.name}</p>
                        <div class="price">
                            <p class="search_price">₪${product.price}</p>
                            ${product.discount && product.discount > product.price ? `<p class="old_price">₪${product.discount}</p>` : ''}
                        </div>
                    </div>
                `;

                // Append the search item to the dropdown
                searchDropdown.appendChild(searchItem);

                // Load the actual image asynchronously
                const imgElement = searchItem.querySelector('img');
                const actualImage = new Image();
                actualImage.src = imgElement.dataset.src;
                actualImage.onload = () => {
                    imgElement.src = actualImage.src; // Replace placeholder with actual image
                };
            });
        }

        // Show the dropdown
        searchDropdown.style.display = "block";
    });
}

// function SearchResultScreen() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const query = urlParams.get('q');
//     const products_search = document.getElementById('products_search');

//     if (query) {
//         products_search.innerHTML = ``;
//         const filteredProducts = Object.keys(all_products_json)
//             .map(key => all_products_json[key])
//             .filter(product => {
//                 return product.name.toLowerCase().includes(query);
//             });


//         if (filteredProducts.length > 0) {
//             filteredProducts.forEach(product => {
//                 products_search.innerHTML += `
//                     <div class="product">
//                         <div class="icons">     
//                             <span><i class="fa-solid fa-cart-plus"></i></span>
//                             <span><i class="fa-solid fa-heart"></i></span>
//                             <span><i class="fa-solid fa-share"></i></span>
//                         </div>
    
//                         <div class="img_product">
//                             <img src="${product.img}" alt="">
//                             <img class="img_hover" src="${product.img_hover}" alt="">
//                         </div>
    
//                         <h3 class="name_product">
//                             <a href="item.html?id=${product.id}">${product.name}</a>
//                         </h3>
    
//                         <div class="stars">
//                             <i class="fa-solid fa-star"></i>
//                             <i class="fa-solid fa-star"></i>
//                             <i class="fa-solid fa-star"></i>
//                             <i class="fa-solid fa-star"></i>
//                             <i class="fa-solid fa-star"></i>
//                         </div>
//                     </div>
//                     `;
//             })
//         }else{
//             products_search.textContent = "nothing found"
//         }
//     } else {
//         products_search.textContent = 'No search input found.';
//     }
// }





// document.addEventListener("DOMContentLoaded", () => {
//     const searchForm = document.querySelector('.search');
//     if (searchForm) {
//         searchForm.addEventListener('submit', function (event) {
//             event.preventDefault(); // Prevent default form submission

//             // Use searchForm instead of 'this'
//             const searchInput = searchForm.querySelector('input[type="search"]');
//             if (!searchInput) {
//                 console.error("searchInput element not found!");
//                 return;
//             }

//             const query = searchInput.value.trim();

//             if (query) {
//                 // Redirect to search_results.html with the query as a URL parameter
//                 window.location.href = `search_results.html?q=${encodeURIComponent(query)}`;
//             } else {
//                 alert("Please enter a search term.");
//             }
//         });
//     }
// });



// Add event listener to hide dropdown when clicking outside


document.addEventListener('click', function (event) {
    const searchContainer = document.querySelector('.searchContainer');
    const searchDropdown = document.querySelector('.searchDropdown');

    // Check if the click is outside the search container
    if (!searchContainer.contains(event.target)) {
        searchDropdown.style.display = "none";
    }
});

// Attach event listener to the search input
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const searchInput = document.querySelector("#searchInput");
        if (searchInput) {
            searchInput.addEventListener("input", searchItem); // Use "input" instead of "focus"
        } else {
            console.error("searchInput element not found!");
        }
    }, 100); // 100ms delay, adjust as needed
});

window.onload = () => {
    const searchInput = document.querySelector("#searchInput");
    if (searchInput) {
        searchInput.addEventListener("focus", getRandomSearchItem);
    } else {
        console.error("searchInput element not found!");
    }
};



// New Arrival products
const swiper_items_sale = document.getElementById("swiper_items_sale");

fetch('/newest10Product')
    .then(response => response.json())
    .then(data => {
        // Sort products by created_at in descending order
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Get the 10 newest products
        const newestProducts = data.slice(0, 10);

        newestProducts.forEach(product => {
            const images = product.images || [];
            let img1 = images[0] || 'default.jpg'; // Use the first image or a default
            let img2 = images[1] || img1; // Use the second image or fallback to the first

            // Ensure the image paths are valid         ///uploads/
            img1 = img1.startsWith("http") ? img1 : `${img1}`; // Use `/uploads/` for local images
            img2 = img2.startsWith("http") ? img2 : `${img2}`; // Use `/uploads/` for local images

            // console.log(`Image 1 Path: ${img1}`);
            // console.log(`Image 2 Path: ${img2}`);

            let priceHTML = `
                <div class="price">
                    <p><span>₪${product.price}</span></p>
                </div>
            `;
            if (product.discount && product.discount < product.price && product.discount != 0) {
                priceHTML = `
                    <div class="price">
                        <p class="discounted_price">₪${product.discount}</p>
                        <p class="old_price"><s>₪${product.price}</s></p>
                    </div>           
                `;
            }

            // Add the product to the swiper
            swiper_items_sale.innerHTML += `
                <div class="product swiper-slide" onclick="location.href='item.html?id=${product.id}'">
                    <div class="icons">
                        <span>
                            <i onclick="addToCart('${product.id}', this); event.stopPropagation();" class="fa-solid fa-cart-plus"></i>
                        </span>
                        <span>
                            <i onclick="addToFav('${product.id}', this); event.preventDefault(); event.stopPropagation();" class="fa-solid fa-heart"></i>
                        </span>
                        <span><i class="fa-solid fa-share"></i></span>
                    </div>
                    
                    <div class="img_product">
                        <img src="${img1}" alt="${product.name}">
                        <img class="img_hover" src="${img2}" alt="${product.name}">
                    </div>

                    <h3 class="name_product">
                        <a>${product.name}</a>
                    </h3>

                    <div class="stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <span>0 Review(s)</span>
                    </div>

                    ${priceHTML}
                </div>
            `;
        });
    })
    .catch(error => {
        console.error("Error fetching newest products:", error);
    });


// Discounted products
const other_product_swiper = document.getElementById("other_product_swiper");

fetch('/products')
    .then(response => response.json())
    .then(data => {

        // Filter products that have a discount
        const discountedProducts = data.filter(product => product.discount && product.discount < product.price && product.discount != 0);

        discountedProducts.forEach(product => {
            const images = product.images || [];
            let img1 = product.images[0] || 'default.jpg';
            let img2 = product.images[1] || img1;

            img1 = img1.startsWith("https") ? img1 : `${img1}`;
            img2 = img2.startsWith("https") ? img2 : `${img2}`;

            let priceHTML = `
                    <div class="price">
                        <p><span>₪${product.price}</span></p>
                    </div>
                `;
            if (product.discount && product.discount < product.price && product.discount != 0) {
                priceHTML = `
            <div class="price">
                <p class="discounted_price">₪${product.discount}</p>
                <p class="old_price"><s>₪${product.price}</s></p>
            </div>           
            `;
            }

            other_product_swiper.innerHTML += `
    <div class="product swiper-slide" onclick="location.href='item.html?id=${product.id}'">
        <div class="icons">
            <span>
                <i onclick="event.preventDefault(); event.stopPropagation();" class="fa-solid fa-heart"></i>
            </span>   
            <span><i class="fa-solid fa-share"></i></span>
        </div>
        
        <div class="img_product">
            <img src="${img1}" alt="">
            <img class="img_hover" src="${img2}" alt="">
        </div>

        <h3 class="name_product">
            <a>${product.name}</a>  <!-- Pass key instead of id -->
        </h3>

        <div class="stars">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <span>0 Review(s)</span>
        </div>

        ${priceHTML}

    </div>
`;

        });
    });

//other_product_swiper2
const other_product_swiper2 = document.getElementById("other_product_swiper2");
fetch('/products')
    .then(response => response.json())
    .then(data => {

        // Filter products that have a discount
        const discountedProducts = data.filter(product => product.discount && product.discount < product.price && product.discount != 0);

        discountedProducts.forEach(product => {
            const images = product.images || [];
            let img1 = product.images[0] || 'default.jpg';
            let img2 = product.images[1] || img1;

            img1 = img1.startsWith("https") ? img1 : `${img1}`;
            img2 = img2.startsWith("https") ? img2 : `${img2}`;

            let priceHTML = `
                    <div class="price">
                        <p><span>₪${product.price}</span></p>
                    </div>
                `;
            if (product.discount && product.discount < product.price && product.discount != 0) {
                priceHTML = `
            <div class="price">
                <p class="discounted_price">₪${product.discount}</p>
                <p class="old_price"><s>₪${product.price}</s></p>
            </div>           
            `;
            }

            other_product_swiper2.innerHTML += `
    <div class="product swiper-slide" onclick="location.href='item.html?id=${product.id}'">
        <div class="icons">
            <span>
                <i onclick="event.preventDefault(); event.stopPropagation();" class="fa-solid fa-heart"></i>
            </span>   
            <span><i class="fa-solid fa-share"></i></span>
        </div>
        
        <div class="img_product">
            <img src="${img1}" alt="">
            <img class="img_hover" src="${img2}" alt="">
        </div>

        <h3 class="name_product">
            <a>${product.name}</a>  <!-- Pass key instead of id -->
        </h3>

        <div class="stars">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <span>0 Review(s)</span>
        </div>

        ${priceHTML}

    </div>
`;

        });
    });

// Extract product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id'); // This will give you the product's ID

// Fetch the product details using the product ID
fetch(`/productDetails?id=${productId}`)
    .then(response => response.json())
    .then(product => {
        // Populate the HTML elements with the fetched product data

        // Product name
        document.getElementById("name").innerText = product.name;


        if (product.discount > 0) {

            document.getElementById("price").innerText = `$${product.discount}`;
            document.getElementById("old_price").innerText = `$${product.price}`;
        } else {
            document.getElementById("price").innerText = `$${product.price}`;
        }

        // Product description
        document.getElementById("item_description").innerText = product.description;

        // Product availability (example based on quantity)
        document.getElementById("availability").innerText = product.quantity > 0 ? 'In Stock' : 'Out of Stock';
        document.getElementById("quantity").innerText = `Quantity: ${product.quantity}`;

        // Images (big and small images)
        const bigImg = document.getElementById("bigImg");
        const smallImgContainer = document.getElementById("smallImgContainer");

        const images = product.images || [];
        if (images.length > 0) {
            // Set the main big image
            bigImg.src = images[0];

            // Set the small images
            smallImgContainer.innerHTML = images.map(image =>
                `<img onclick="changeItemImage('${image}')" src="${image}" alt="Small Image">`).join('');
        }

        // Optional: Add stars for rating
        const stars = document.getElementById("stars");
        const fullStars = 5; // Assuming 5 stars max
        let starHTML = '';
        for (let i = 0; i < fullStars; i++) {
            starHTML += `<i class="fa-solid fa-star"></i>`;
        }
        stars.innerHTML = starHTML;

    })
    .catch(error => {
        console.error("Error fetching product details: ", error);
    });

// Function to change the main image when a small image is clicked
function changeItemImage(src) {
    document.getElementById("bigImg").src = src;
}




