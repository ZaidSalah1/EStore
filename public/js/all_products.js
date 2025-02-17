// // Open and close fliter

// var filter = document.querySelector(".filter");
// function open_close_filter(){
//     filter.classList.toggle("active");
// }

// fetch('js/items.json')
//         .then(response => response.json())
//         .then(data => {
//             // console.log(data)
//             const products_dev = document.getElementById("products_dev");
//             data.forEach(product => {

//                     const check_discount = product.old_price ? `<p class="old_price">₪${product.old_price}</p>` : "";
//                     const percent_disc_div = product.old_price ? `<span class="sale_present">%${Math.floor((product.old_price - product.price) / product.old_price * 100)}</span>` : "";

//                     all_products_json = data;

//                     products_dev.innerHTML += `
//                         <div class="product swiper-slide">
    
//                     <div class="icons">     
//                         <span><i onclick = "addToCart(${product.id}, this)" class="fa-solid fa-cart-plus"></i></span>
//                         <span><i class="fa-solid fa-heart"></i></span>
//                         <span><i class="fa-solid fa-share"></i></span>
//                     </div>
    
//                     ${percent_disc_div}
    
//                     <div class="img_product">
//                         <img src="${product.img}" alt="">
//                         <img class="img_hover" src="${product.img_hover}" alt="">
//                     </div>
    
//                     <h3 class="name_product">
//                         <a href="#">${product.name}</a>
//                     </h3>
//                     <div class="stars">
//                         <i class="fa-solid fa-star"></i>
//                         <i class="fa-solid fa-star"></i>
//                         <i class="fa-solid fa-star"></i>
//                         <i class="fa-solid fa-star"></i>
//                         <i class="fa-solid fa-star"></i>
//                     </div>
        
//                     <div class="price">
//                         <p><span>₪${product.price}</span></p>
//                         ${check_discount}
//                     </div>
//                 </div>
//                     `;
//             });
            
//         });
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, get, set, push } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

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
const storage = getStorage(app); // Initialize Firebase Storage

// Function to fetch all products
function fetchAllProducts() {
    const productRef = ref(database, 'products');

    get(productRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                populateProducts(data);
            } else {
                console.log("No data Available");
            }
        })
        .catch((error) => {
            console.error("Error fetching products:", error);
        });
}

// Function to populate products in the UI
function populateProducts(data) {
    const product_div = document.getElementById('products_dev');
    const products = Object.values(data); // Convert object to array
    product_div.innerHTML = ''; // Clear existing products
    products.forEach(product => {
        //
        let percent_disc = ""; // Initialize the discount percentage variable

        // Calculate discount percentage if old_price exists
        if (product.old_price) {
            percent_disc = Math.floor((product.old_price - product.price) / product.old_price * 100);
        }

        product_div.innerHTML += `
                <div class="product">
                <div class="icons">     
                    <span><i class="fa-solid fa-cart-plus"></i></span>
                    <span><i class="fa-solid fa-heart"></i></span>
                    <span><i class="fa-solid fa-share"></i></span>
                </div>

                  ${percent_disc ? `<span class="sale_present">%${percent_disc}</span>` : ''} <!-- Only show if there is a discount -->


                <div class="img_product">
                    <img src="${product.img}" alt="">
                    <img class="img_hover" src="${product.img_hover}" alt="">
                </div>

                <h3 class="name_product">
                  <a href="item.html?id=${product.id}">${product.name}</a>  <!-- Pass key instead of id -->
                </h3>

                <div class="stars">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                </div>
    
                <div class="price">
                    <p><span>₪${product.price}</span></p>
                    ${product.old_price ? `<p class="old_price">₪${product.old_price}</p>` : ''}
                </div>
            </div>
        `;
    });
}

fetchAllProducts() ;

document.addEventListener("DOMContentLoaded", function(){
    const urlParams = new URLSearchParams(window.location.search);
    const productType = urlParams.get('type');
    if(productType){
        fetchProductsByType(productType);
    }
});

function fetchProductsByType(type){
    const productRef = ref(database,'products');

    get(productRef)
    .then((snapshot) => {
        if(snapshot.exists()){
            const data = snapshot.val();
            const filteredData = Object.values(data).filter(product => product.type === type);
            populateProducts(filteredData);
        }else{
            console.log("No data available for the selected type.");
        }
    })  .catch((error) => {
        console.error("Error fetching products by type:", error);
    });
}