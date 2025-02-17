// Import Firebase SDK functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, get, set, push, update } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
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


// Function to fetch top 5 products
function fetchTopProductsAndDisplayChart() {
    const productsRef = ref(database, 'products');

    get(productsRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const products = snapshot.val();

                // Convert products object to an array and sort by salesCount
                const sortedProducts = Object.entries(products)
                    .map(([id, product]) => ({ id, ...product }))
                    .sort((a, b) => b.salesCount - a.salesCount)
                    .slice(0, 5); // Get the top 5 products

                // Extract product names and sales counts
                const productNames = sortedProducts.map(product => product.name);
                const productSales = sortedProducts.map(product => product.salesCount);

                // Call function to render chart
                renderSalesChart(productNames, productSales);
            } else {
                console.log("No products found in the database.");
            }
        })
        .catch((error) => {
            console.error("Error fetching products:", error);
        });
}

// Function to render the chart
function renderSalesChart(productNames, productSales) {
    const ctx = document.getElementById('salesChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar', // Choose between 'bar', 'line', 'pie', etc.
        data: {
            labels: productNames,
            datasets: [{
                label: 'Top 5 Sales',
                data: productSales,
                backgroundColor: [
                    '#4caf50',
                    '#ff9800',
                    '#f44336',
                    '#2196f3',
                    '#9c27b0'
                ],
                borderColor: '#ffffff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#333',
                    },
                    grid: {
                        color: '#ddd',
                    }
                },
                x: {
                    ticks: {
                        color: '#333',
                        callback: function (value, index, values) {
                            const name = productNames[index];
                            return name.length > 15 ? name.substring(0, 15) + "..." : name;
                        }
                    },
                    grid: {
                        color: '#ddd',
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `Sales: ${context.raw}`;
                        }
                    }
                }
            }
        }
    });
}


// Call the function to fetch products and display the chart
fetchTopProductsAndDisplayChart();


// Function to fetch all products
function fetchAllProducts() {
    const productRef = ref(database, 'products');

    get(productRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                populateProducts(data);
                // getRandomSearchItem(data);
                handleSearch(data);
                fetchGeneralData(data);
            } else {
                console.log("No data Available");
            }
        })
        .catch((error) => {
            console.error("Error fetching products:", error);
        });
}

function fetchGeneralData(data) {
    const productsCountDiv = document.querySelector('#productsCount .count'); // Select the element with class 'count'

    if (productsCountDiv && data) {
        const productsCount = Object.keys(data).length; // Count the number of products
        productsCountDiv.textContent = productsCount;   // Update the text content
    } else {
        console.error("Unable to update products count. Element not found or no data available.");
    }
}



// Function to populate products in the UI
function populateProducts(data) {
    const product_div = document.getElementById('products_dev');
    const products = Object.values(data); // Convert object to array


    product_div.innerHTML = ''; // Clear existing products
    products.forEach(product => {
        const isSoldOut = !product.quantity || product.quantity <= 0;

        // data-product-id="${product.id}" onclick="window.open('item.html?id=${product.id}', '_blank')"
        product_div.innerHTML += `
        <div class="product" >  
            <div class="img_product">
                <img src="${product.img}" alt="">
                <img class="img_hover" src="${product.img_hover}" alt="">
            </div>
            <h3 class="name_product">
                ${product.name}
            </h3>
            <div class="price">
                <p><span>₪${product.price}</span></p>
                 ${product.old_price ? `<p class="old_price">₪${product.old_price}</p>` : ''}


            </div>
            <div class="edit_btn" onclick="openEditModal(${product.id})">
                Edit <i class="fa-solid fa-pen-to-square"></i>
            </div>

            ${isSoldOut ? `
                    <div class="sold_out">
                            <p>Sold Out</p>
                        </div>
                `: ''}
        </div>

        `;
    });
}

function resetFormFields() {
    // Reset the form fields
    document.getElementById('addProductForm').reset();

    // Clear selected files and URLs
    selectedFiles = []; // Ensure this is declared in the right scope
    selectedUrls = []; // Ensure this is declared in the right scope
    mainImageFile = null; // Reset the main image file variable
    mainImageUrl = null; // Reset the main image URL variable

    // Clear image previews
    const mainImagePreviewContainer = document.getElementById('mainImagePreviewContainer');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');

    // Clear main image preview
    mainImagePreviewContainer.innerHTML = '';

    // Clear other image previews
    imagePreviewContainer.innerHTML = '';

    // Optionally, reset the dropdown or other custom elements
    document.getElementById('productType').value = ''; // Reset dropdown value if needed
}


function addProductToDatabase(product) {
    const productRef = ref(database, 'products');

    get(productRef)
        .then((snapshot) => {
            const products = snapshot.val();
            let newId;

            // Check for the existing keys
            if (products) {
                const existingIds = Object.keys(products).map(Number); // Get existing IDs as numbers
                newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1; // Increment the highest ID
            } else {
                newId = 1; // If no products exist, start with ID 1
            }

            const newProductRef = ref(database, `products/${newId}`);
            product.id = newId;
            set(newProductRef, product)
                .then(() => {
                    console.log('Product added successfully with ID:', newId);
                    fetchAllProducts(); // Refresh the product list
                })
                .catch((error) => {
                    console.error("Error adding product:", error);
                });
        })
        .catch(error => {
            console.error("Error fetching products:", error);
        });
}

fetchAllProducts();


// -----------------------------------------------------------

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
                <div class="searchItem">
                    <img src="${product.img}" alt="">
                    <div class="name_price">
                        <p class="name">${product.name}</p>
                        <div class="price">
                            <p class="search_price">₪${product.price}</p>
                            ${product.old_price ? `<p class="old_price">₪${product.old_price}</p>` : ''}
                        </div>
                    </div> 
                </div>
        `;
    });
}

// Function to handle the search and display matching results
//
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
            <div class="searchItem" onclick="openEditModal('${product.id}')">
                <img src="${product.img}" alt="">
                <div class="name_price">
                    <p class="name">${product.name}</p>
                    <div class="price">
                        <p class="search_price">₪${product.price}</p>
                        ${product.old_price ? `<p class="old_price">₪${product.old_price}</p>` : ''}
                    </div>
                </div> 
            </div>
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



// Array to store selected image files and URLs
let selectedFiles = [];
let selectedUrls = [];
let mainImageFile = null; // Store selected main image file
let mainImageUrl = null;  // Store main image URL
let editingProductId = null;

// Handle main image file selection
document.getElementById('productImageMain').addEventListener('change', function (event) {
    mainImageFile = event.target.files[0]; // Capture the selected file
    mainImageUrl = null; // Clear the mainImageUrl since a new file is selected

    const reader = new FileReader();
    reader.onload = function (e) {
        const mainImageContainer = document.getElementById('mainImagePreviewContainer');
        mainImageContainer.innerHTML = ''; // Clear previous preview if any
        const imgWrapper = createImagePreview1(e.target.result); // Preview main image
        mainImageContainer.prepend(imgWrapper); // Add main image preview at the top
    };
    reader.readAsDataURL(mainImageFile);
});

// Handle main image URL input
document.getElementById('productImageUrlMain').addEventListener('input', function () {
    mainImageUrl = document.getElementById('productImageUrlMain').value;
    mainImageFile = null; // Clear the mainImageFile since a new URL is selected

    if (mainImageUrl) {
        const mainImageContainer = document.getElementById('mainImagePreviewContainer');
        mainImageContainer.innerHTML = ''; // Clear previous preview if any
        const imgWrapper = createImagePreview1(mainImageUrl, 'main', 'url'); // Preview main image
        mainImageContainer.prepend(imgWrapper); // Add main image preview at the top
    }
});

// Handle other images from file input
document.getElementById('productImages').addEventListener('change', function (event) {
    const files = Array.from(event.target.files); // Convert the file list to an array

    selectedFiles = selectedFiles.concat(files);

    updateImagePreviews(); // Update the previews for both file and URL images
    updateFileInput(); // Sync the file input with the selected files
});

// Handle other images from URL input
document.getElementById('productImageUrl').addEventListener('input', function () {
    const urlInput = document.getElementById('productImageUrl').value;

    if (urlInput) {
        selectedUrls.push(urlInput); // Add the URL to the selectedUrls array
        updateImagePreviews(); // Update the previews for both file and URL images
        document.getElementById('productImageUrl').value = ''; // Clear input field
    }
});

// Function to update image previews (both file and URL)
function updateImagePreviews() {
    const imageContainer = document.getElementById('imagePreviewContainer');
    imageContainer.innerHTML = ''; // Clear container before updating previews

    // Preview files from selectedFiles array
    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgWrapper = createImagePreview(e.target.result, index, 'file');
            imageContainer.appendChild(imgWrapper);
        };
        reader.readAsDataURL(file); // Convert the file to a data URL
    });

    // Preview images from selectedUrls array
    selectedUrls.forEach((url, index) => {
        const imgWrapper = createImagePreview(url, index, 'url');
        imageContainer.appendChild(imgWrapper);
    });
}

// Function to create image preview and remove button
function createImagePreview1(src) {
    const imgWrapper = document.createElement('div'); // Create a wrapper for image + remove button
    imgWrapper.classList.add('image-wrapper'); // Add class for styling

    const imgElement = document.createElement('img');
    imgElement.src = src;
    imgElement.classList.add('preview-image'); // Add a class for styling

    // Only for main image, no remove button needed since it gets replaced automatically

    // Append the image to the wrapper
    imgWrapper.appendChild(imgElement);

    return imgWrapper;
}

// Function to create image preview and remove button
function createImagePreview(src, index, type) {
    const imgWrapper = document.createElement('div'); // Create a wrapper for image + remove button
    imgWrapper.classList.add('image-wrapper'); // Add class for styling

    const imgElement = document.createElement('img');
    imgElement.src = src;
    imgElement.classList.add('preview-image'); // Add a class for styling

    const removeButton = document.createElement('i');
    removeButton.classList.add('fa-solid', 'fa-circle-minus', 'remove-icon'); // Add Font Awesome classes

    // Add event listener to the remove button
    removeButton.addEventListener('click', function () {
        if (type === 'file') {
            selectedFiles.splice(index, 1); // Remove the file from the array
        } else if (type === 'url') {
            selectedUrls.splice(index, 1); // Remove the URL from the array
        }

        updateImagePreviews(); // Re-render the image previews
        updateFileInput(); // Update the file input to reflect the remaining files
    });

    // Append the image and remove button to the wrapper
    imgWrapper.appendChild(imgElement);
    imgWrapper.appendChild(removeButton);

    return imgWrapper;
}

// Function to update the file input field to reflect the current selectedFiles array
function updateFileInput() {
    const dataTransfer = new DataTransfer();
    selectedFiles.forEach(file => {
        dataTransfer.items.add(file); // Add each file to the DataTransfer object
    });
    document.getElementById('productImages').files = dataTransfer.files; // Update the file input
}

// Handle form submission with both files and URLs
addProductForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const productName = document.getElementById('productName').value;
    const productType = document.getElementById('productType').value;
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productDisPrice = parseFloat(document.getElementById('productDisPrice').value) || null;
    const productDescription = document.getElementById('productDescription').value;
    const productQuantity = document.getElementById('productQuantity').value;

    const uploadedImageUrls = []; // Array to store URLs of uploaded images
    let uploadPromises = []; // To handle all the upload promises

    // Upload the main image if selected from file input
    if (mainImageFile) {
        const mainImageRef = storageRef(storage, 'product-images/' + mainImageFile.name);
        uploadPromises.push(
            uploadBytes(mainImageRef, mainImageFile)
                .then(snapshot => getDownloadURL(snapshot.ref))
                .then(url => {
                    mainImageUrl = url; // Store the uploaded main image URL
                    uploadedImageUrls.unshift(mainImageUrl); // Place the main image at the start of the array
                })
                .catch(error => console.error('Error uploading main image:', error))
        );
    }

    // Upload other selected files to storage
    if (selectedFiles.length > 0) {
        selectedFiles.forEach((imageFile) => {
            const fileRef = storageRef(storage, 'product-images/' + imageFile.name);
            uploadPromises.push(
                uploadBytes(fileRef, imageFile)
                    .then(snapshot => getDownloadURL(snapshot.ref))
                    .then(url => uploadedImageUrls.push(url))
                    .catch(error => console.error("Error uploading image:", error))
            );
        });
    }

    // After all uploads are done, combine file URLs with manually entered URLs and submit product
    Promise.all(uploadPromises).then(() => {
        const finalImageUrls = uploadedImageUrls.concat(selectedUrls); // Combine URLs

        const product = {
            name: productName,
            price: productPrice,
            old_price: productDisPrice,
            description: productDescription,
            quantity: productQuantity,
            images: finalImageUrls, // All image URLs
            img: mainImageUrl || finalImageUrls[0], // Main image URL or fallback to the first
            img_hover: finalImageUrls[1] || finalImageUrls[0], // Second image for hover
            type: productType
        };

        // Call the function to add product to Firebase
        addProductToDatabase(product);
    }).catch(error => {
        console.error("Error uploading images:", error);
    });

});


window.openEditModal = function (productId) {
    editingProductId = productId;
    console.log(productId)
    document.querySelector('.btn-edit').style.display = 'block';
    document.querySelector('.btn-submit').style.display = 'none';


    selectedFiles = [];  // Clear selected files for new uploads only
    selectedUrls = [];   // Clear selected URLs for new uploads only

    const modal = document.getElementById('addProductModal');
    modal.style.display = 'block';

    const productRef = ref(database, 'products');

    get(productRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const product = Object.values(data).find(item => item.id == productId);

                // Prepopulate form data
                document.getElementById('productName').value = product.name;
                document.getElementById('productType').value = product.type;
                document.getElementById('productPrice').value = product.price;
                document.getElementById('productDisPrice').value = product.old_price;
                document.getElementById('productDescription').value = product.description;
                document.getElementById('productQuantity').value = product.quantity;

                // Preview main image
                const mainImageContainer = document.getElementById('mainImagePreviewContainer');
                mainImageContainer.innerHTML = '';
                const imgWrapper = createImagePreview1(product.img);
                mainImageContainer.prepend(imgWrapper);

                const imageContainer = document.getElementById('imagePreviewContainer');
                imageContainer.innerHTML = '';

                product.images.forEach((image, index) => {
                    const imgWrapper = createImagePreview(image, index, 'url');
                    imageContainer.appendChild(imgWrapper);
                    selectedUrls.push(image); // Add existing images to URLs Array
                });

                // Set up edit submission
                document.querySelector('.btn-edit').removeEventListener('click', handleEditClick);
                document.querySelector('.btn-edit').addEventListener('click', handleEditClick);

                function handleEditClick(event) {
                    event.preventDefault();

                    const updatedFields = {};
                    const newName = document.getElementById('productName').value;
                    const newType = document.getElementById('productType').value;
                    const newPrice = parseFloat(document.getElementById('productPrice').value);
                    const newDisPrice = parseFloat(document.getElementById('productDisPrice').value) || null;
                    const newDescription = document.getElementById('productDescription').value;
                    const newQuantity = document.getElementById('productQuantity').value;

                    if (newName !== product.name) updatedFields.name = newName;
                    if (newType !== product.type) updatedFields.type = newType;
                    if (newPrice !== product.price) updatedFields.price = newPrice;
                    if (newDisPrice !== product.old_price) updatedFields.old_price = newDisPrice;
                    if (newDescription !== product.description) updatedFields.description = newDescription;
                    if (newQuantity !== product.quantity) updatedFields.quantity = newQuantity;

                    let uploadPromises = [];
                    // let updatedImageUrls = product.images || []; // Initialize with existing images from the database
                    let updatedImageUrls = [...product.images]; // Start with existing images

                    // Upload main image if a new file is selected
                    if (mainImageFile) {
                        const mainImageRef = storageRef(storage, 'product-images/' + mainImageFile.name);
                        uploadPromises.push(
                            uploadBytes(mainImageRef, mainImageFile)
                                .then(snapshot => getDownloadURL(snapshot.ref))
                                .then(url => {
                                    mainImageUrl = url;
                                    updatedFields.img = mainImageUrl; // Update main image URL
                                })
                                .catch(error => console.error('Error uploading main image:', error))
                        );
                    } else if (mainImageUrl) {
                        updatedFields.img = mainImageUrl; // Use existing main image URL if unchanged
                    }

                    // Handle additional selected files
                    selectedFiles.forEach((imageFile) => {
                        const fileRef = storageRef(storage, 'product-images/' + imageFile.name);
                        uploadPromises.push(
                            uploadBytes(fileRef, imageFile)
                                .then(snapshot => getDownloadURL(snapshot.ref))
                                .then(url => {
                                    updatedImageUrls.push(url); // Add the new URL to updated images
                                })
                                .catch(error => console.error("Error uploading image:", error))
                        );
                    });


                    // Add URLs from selectedUrls array to updatedImageUrls
                    updatedImageUrls.push(...selectedUrls);

                    // Wait for all uploads to complete before updating the database
                    Promise.all(uploadPromises).then(() => {
                        updatedFields.images = updatedImageUrls; // Add all image URLs to fields for update
                        const productRef = ref(database, 'products/' + editingProductId);

                        if (Object.keys(updatedFields).length > 0) {
                            update(productRef, updatedFields)
                                .then(() => {
                                    console.log('Product updated successfully');
                                    closeModal();
                                    fetchAllProducts(); // Refresh the product list after update
                                })
                                .catch(error => console.error("Error updating product:", error));
                        } else {
                            closeModal();
                        }
                    });
                }


            } else {
                console.log("No data Available");
            }
        })
        .catch(error => console.error("Error fetching products:", error));
};



// window.openEditModal = function(productId) {
//     editingProductId = productId; // Set the editing product ID

//     const modal = document.getElementById('addProductModal');
//     modal.style.display = 'block'; // Show the modal 


//     const productRef = ref(database, 'products');

//     get(productRef)
//         .then((snapshot) => {
//             if (snapshot.exists()) {
//                 const data = snapshot.val();
//                 const product = Object.values(data).find(item => item.id == productId);

//                 document.getElementById('productName').value = product.name;
//                 document.getElementById('productType').value = product.type;
//                 document.getElementById('productPrice').value = product.price;
//                 document.getElementById('productDisPrice').value = product.old_price;
//                 document.getElementById('productDescription').value = product.description;
//                 document.getElementById('productQuantity').value = product.quantity;
//                 //  document.getElementById('productImageUrlMain').value = product.img;

//                  const mainImageContainer = document.getElementById('mainImagePreviewContainer');
//                 mainImageContainer.innerHTML = ''; // Clear previous preview if any


//                 const imgWrapper =  createImagePreview1(product.img)// Preview main image
//                 mainImageContainer.prepend(imgWrapper); // Add main image preview at the top


//                 const imageContainer = document.getElementById('imagePreviewContainer');
//                 imageContainer.innerHTML = '';

//                 product.images.forEach((image, index) => {
//                     console.log(image);
//                     const imgWrapper = createImagePreview(image, index, 'url');
//                     imageContainer.appendChild(imgWrapper);
//                 });

//                 const productName = document.getElementById('productName').value;
//                 const productType = document.getElementById('productType').value;
//                 const productPrice = parseFloat(document.getElementById('productPrice').value);
//                 const productDisPrice = parseFloat(document.getElementById('productDisPrice').value) || null;
//                 const productDescription = document.getElementById('productDescription').value;
//                 const productQuantity  = document.getElementById('productQuantity').value;

//                 const updatedProduct  = {
//                     name: productName,
//                     price: productPrice,
//                     old_price: productDisPrice,
//                     description: productDescription,
//                     quantity: productQuantity,
//                     // images: finalImageUrls, // All image URLs
//                     // img: mainImageUrl || finalImageUrls[0], // Main image URL or fallback to the first
//                     // img_hover: finalImageUrls[1] || finalImageUrls[0], // Second image for hover
//                     type: productType
//                 };    

//                 console.log(productId);
//                 document.querySelector('.btn-edit').addEventListener('click', function(event){
//                     event.preventDefault();
//                     const productRef = ref(database, 'products/' + productId); // Correct product reference
//                     set(productRef, updatedProduct )
//                     .then(() =>{
//                         console.log('Product updated successfully...');
//                         closeModal(); // Function to close the modal after successful update
//                     })
//                 });

//             } else {
//                 console.log("No data Available");
//             }
//         })
//         .catch((error) => {
//             console.error("Error fetching products:", error);
//         });

// }


// Function to close the modal

// window.openEditModal = function(productId) {
//     editingProductId = productId; // Set the editing product ID

//     const modal = document.getElementById('addProductModal');
//     modal.style.display = 'block'; // Show the modal 

//     const productRef = ref(database, 'products');

//     get(productRef)
//         .then((snapshot) => {
//             if (snapshot.exists()) {
//                 const data = snapshot.val();
//                 const product = Object.values(data).find(item => item.id == productId);

//                 // Populate form with existing product data
//                 document.getElementById('productName').value = product.name;
//                 document.getElementById('productType').value = product.type;
//                 document.getElementById('productPrice').value = product.price;
//                 document.getElementById('productDisPrice').value = product.old_price;
//                 document.getElementById('productDescription').value = product.description;
//                 document.getElementById('productQuantity').value = product.quantity;

//                 // Clear and preview main image
//                 const mainImageContainer = document.getElementById('mainImagePreviewContainer');
//                 mainImageContainer.innerHTML = ''; // Clear previous preview if any
//                 const imgWrapper = createImagePreview1(product.img); // Preview main image
//                 mainImageContainer.prepend(imgWrapper); // Add main image preview at the top

//                 // Clear and preview other images
//                 const imageContainer = document.getElementById('imagePreviewContainer');
//                 imageContainer.innerHTML = '';
//                 product.images.forEach((image, index) => {
//                     const imgWrapper = createImagePreview(image, index, 'url');
//                     imageContainer.appendChild(imgWrapper);
//                 });

//                 // Handle edit form submission
//                 document.querySelector('.btn-edit').removeEventListener('click', handleEditClick); // Remove any existing listener
//                 document.querySelector('.btn-edit').addEventListener('click', handleEditClick); // Add new event listener

//                 function handleEditClick(event) {
//                     event.preventDefault();

//                     const newName = document.getElementById('productName').value;
//                     const newType = document.getElementById('productType').value;
//                     const newPrice = parseFloat(document.getElementById('productPrice').value);
//                     const newDisPrice = parseFloat(document.getElementById('productDisPrice').value) || null;
//                     const newDescription = document.getElementById('productDescription').value;
//                     const newQuantity  = document.getElementById('productQuantity').value;

//                     // Create an object to store only the updated fields
//                     const updatedFields = {};

//                     if (newName !== product.name) updatedFields.name = newName;
//                     if (newType !== product.type) updatedFields.type = newType;
//                     if (newPrice !== product.price) updatedFields.price = newPrice;
//                     if (newDisPrice !== product.old_price) updatedFields.old_price = newDisPrice;
//                     if (newDescription !== product.description) updatedFields.description = newDescription;
//                     if (newQuantity !== product.quantity) updatedFields.quantity = newQuantity;

//                     // // Check if the images have been changed
//                     // updatedFields.images = product.images; // Assume no change in images for now
//                      updatedFields.img = product.img; // Same for the main image
//                     // updatedFields.img_hover = product.images[1] || product.images[0]; // Fallback for hover image


//                     if (Object.keys(updatedFields).length > 0) {
//                         const productRef = ref(database, 'products/' + editingProductId);
//                         update(productRef, updatedFields) // Use update() to modify only changed fields
//                             .then(() => {
//                                 console.log('Product updated successfully...');
//                                 closeModal(); // Close the modal after successful update
//                                 fetchAllProducts(); // Refresh product list
//                             })
//                             .catch((error) => {
//                                 console.error("Error updating product:", error);
//                             });
//                     } else {
//                         console.log('No changes to update.');
//                         closeModal(); // Close the modal if no changes
//                     }
//                 }
//             } else {
//                 console.log("No data Available");
//             }
//         })
//         .catch((error) => {
//             console.error("Error fetching products:", error);
//         });
// };


function closeModal() {
    const modal = document.getElementById('addProductModal');
    modal.style.display = 'none'; // Hide the modal
    resetFormFields(); // Reset form fields after closing the modal
}

// Close modal when the 'x' is clicked
document.querySelector('.close').addEventListener('click', closeModal);

// Close modal when user clicks outside of the modal content
window.onclick = function (event) {
    const modal = document.getElementById('editProductModal');
    if (event.target === modal) {
        closeModal();
    }
};

window.addEventListener('resize', function () {
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.maxHeight = `${window.innerHeight * 0.9}px`; // 90% of viewport height
    }
});
//---------------------
