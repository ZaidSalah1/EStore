// import { response } from "express";

// const { response } = require("express");


// =================== 🚀🚀🚀 Editing Section Start 🚀🚀🚀 =================== \\

const products_div = document.getElementById("products_dev");
let selectedImagesArray = [];
let currProductId = null;
// Fetch and display products
fetch('/products')
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
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

            products_div.innerHTML += `
                <div class="product" data-product-id="${product.id}">  
                    <div class="img_product">
                        <img src="${img1}" alt="">
                        <img class="img_hover" src="${img2}" alt="">
                    </div>
                    <h3 class="name_product">
                        ${product.name}
                    </h3>
                    ${priceHTML}
                    <div class="edit_btn">
                        Edit <i class="fa-solid fa-pen-to-square"></i>
                    </div>
                </div>
            `;
        });

        // Add event listeners to the "Edit" buttons
        const editButtons = document.querySelectorAll('.edit_btn');

        editButtons.forEach((btn) => {
            btn.addEventListener('click', function () {
                // Get product ID (from the data attribute)
                const productId = this.closest('.product').getAttribute('data-product-id');
                console.log("Editing product ID:", productId); // Debugging line
        
                // Show the edit product window
                productsContent.style.display = 'none';
                editProductWindow.style.display = 'block';
        
                // Fetch product details
                fetch(`/product/${productId}`)
                    .then(response => response.json())
                    .then(product => {
                        console.log("Product details from backend:", product);
                        currProductId = productId; // Set the current product ID
                        // Populate the form fields
                        document.getElementById('editProductName').value = product.name;
                        document.getElementById('editProductDescription').value = product.description;
                        document.getElementById('editBasePricing').value = product.price;
                        document.getElementById('editStock').value = product.quantity;
        
                        // Fetch and populate product types
                        fetch('/productTypes')
                            .then(response => response.json())
                            .then(productTypes => {
                                const select = document.getElementById('editProductTypeSelect');
                                select.innerHTML = '<option value="0">Select a Product Type</option>'; // Clear existing options
        
                                productTypes.forEach(productType => {
                                    const option = document.createElement('option');
                                    option.value = productType.id;
                                    option.textContent = productType.name;
                                    select.appendChild(option);
                                });
        
                                select.value = product.product_type_id; // Set selected value for product type
                            })
                            .catch(error => console.error("Error fetching product types:", error));
        
                        selectedImagesArray = product.images;
        
                        const selectedImages = document.querySelector('.selected-images-edit');
        
                        selectedImages.innerHTML = `
                            <div class="image-container">
                                <img src="${selectedImagesArray[0]}" class="big-img" alt="Selected Image">
                                <div class="small-img">
                                    ${selectedImagesArray.map(smlImg => `<img src="${smlImg}" class="img" alt="" >`).join('')}
                                    <div class="add-boxV2" onclick="document.getElementById('editAdditionalFileInput').click()">
                                        <span>+</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    })
                    .catch(error => console.error("Error fetching product details:", error));
            });
        });
    })
    .catch(error => console.error("Error fetching products:", error));


document.getElementById('edit_Product_Form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const updatedProduct = {
        name: document.getElementById('editProductName').value,
        description: document.getElementById('editProductDescription').value,
        price: parseFloat(document.getElementById('editBasePricing').value),
        quantity: parseInt(document.getElementById('editStock').value),
        type_id: parseInt(document.getElementById('editProductTypeSelect').value),
        images: selectedImagesArray.filter(img => typeof img === "string") // Only keep valid URLs
    };
    

    if (selectedImagesArray.length > 0) {
        try {
            const uploadedURLs = await uploadEditFiles(selectedImagesArray);
            updatedProduct.images.push(...uploadedURLs);
            await sendEditFormData(updatedProduct, currProductId); // Send the form data to the server
            alert("Product UPDATED successfully!");

            closeModal(); // Close the modal
        } catch (error) {
            console.error("Error:", error);
            alert("Error Updating product. Please try again.");
        }
    } else {
        console.log("No images selected.");
        alert("Please select at least one image.");
    }


});


// Function to upload files and return their URLs
async function uploadEditFiles(files) {
    const uploadedURLs = [];
    
    for (const file of files) {
        if (!(file instanceof File)) {
            // Skip URLs, only upload new files
            uploadedURLs.push(file);
            continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/upload-image", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                console.error("Upload failed:", response.statusText);
                continue;
            }

            const data = await response.json();
            if (data.url) {
                uploadedURLs.push(data.url);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    }

    return uploadedURLs;
}

// Function to send form data to the server
async function sendEditFormData(formData, productId) {
    const response = await fetch(`/updateProduct/${productId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Success:", data);
    return data;
}



// Function to handle file selection for editing product images
function handleEditFileSelect(event) {
    const file = event.target.files[0]; // Get the selected file
    if (file && file instanceof File) {
        selectedImagesArray.push(file); // Store the File object
        updateEditImagePreview(); // Update the preview
    } else {
        console.error("The selected file is invalid.");
    }
}

// Function to update the image preview when editing
// Function to update the image preview when editing
function updateEditImagePreview() {
    const selectedImages = document.querySelector('.selected-images-edit');
    if (selectedImagesArray.length > 0) {
        // Handle big image preview
        const bigImageUrl = selectedImagesArray[0] instanceof File
            ? URL.createObjectURL(selectedImagesArray[0])
            : selectedImagesArray[0];

        // Handle small images preview
        const smallImagesHtml = selectedImagesArray.slice(1).map((fileOrUrl, index) => {
            const imageUrl = fileOrUrl instanceof File ? URL.createObjectURL(fileOrUrl) : fileOrUrl;
            return `<img src="${imageUrl}" alt="Preview ${index + 1}">`;
        }).join('');

        selectedImages.innerHTML = `
            <div class="image-container">
                <img src="${bigImageUrl}" class="big-img" alt="Selected Image">
                <div class="small-img">
                    ${smallImagesHtml}
                    <div class="add-boxV2" onclick="document.getElementById('editAdditionalFileInput').click()">
                        <span>+</span>
                    </div>
                </div>
            </div>
        `;
    }
}


// Create additional file input dynamically for editing images
const editAdditionalFileInput = document.createElement('input');
editAdditionalFileInput.type = 'file';
editAdditionalFileInput.id = 'editAdditionalFileInput';
editAdditionalFileInput.style.display = 'none';
editAdditionalFileInput.accept = 'image/*';
editAdditionalFileInput.addEventListener('change', handleEditFileSelect);
document.body.appendChild(editAdditionalFileInput);

// =================== 🏁🏁🏁 Section Editing product Finished 🏁🏁🏁 =================== \\
//🔲
//🔲
//🔲
//🔲
//🔲
//🔲
//🔲
//🔲
// =================== 🚀🚀🚀 Adding Section Start 🚀🚀🚀 =================== \\

// Function to handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
        selectedImagesArray.push(file); // Store the File object
        updateImagePreview(); // Update the preview
    }
}

// Function to update the image preview
function updateImagePreview() {
    const selectedImages = document.querySelector('.selected-images');
    if (selectedImagesArray.length > 0) {
        const bigImageUrl = URL.createObjectURL(selectedImagesArray[0]); // Use the first image as the big preview
        const smallImagesHtml = selectedImagesArray.slice(1).map((file, index) => `
                                <img src="${URL.createObjectURL(file)}" alt="Preview ${index + 1}">
                            `).join('');

        selectedImages.innerHTML = `
                                <div class="image-container">
                                    <img src="${bigImageUrl}" class="big-img" alt="Selected Image">
                                    <div class="small-img">
                                        ${smallImagesHtml}
                                        <div class="add-boxV2" onclick="document.getElementById('additionalFileInput').click()">
                                            <span>+</span>
                                        </div>
                                    </div>
                                </div>
                            `;
    }
}

// Function to trigger additional file input
function addAdditionalImage() {
    document.getElementById('additionalFileInput').click();
}

// Create additional file input dynamically
const additionalFileInput = document.createElement('input');
additionalFileInput.type = 'file';
additionalFileInput.id = 'additionalFileInput';
additionalFileInput.style.display = 'none';
additionalFileInput.accept = 'image/*';
additionalFileInput.addEventListener('change', handleFileSelect);
document.body.appendChild(additionalFileInput);

// Attach event listener to the main file input
document.getElementById('fileInput').addEventListener('change', handleFileSelect);

// Handle form submission
document.getElementById('add_Product_Form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Prepare form data
    const formData = {
        name: document.getElementById("productName").value,
        price: parseFloat(document.getElementById("basePricing").value),
        description: document.getElementById("productDescription").value,
        quantity: parseInt(document.getElementById("Stock").value),
        discount: parseFloat(document.getElementById("discount").value) || 0,
        type_id: parseInt(document.getElementById("productTypeSelect").value),
        images: [] // Will be populated with image URLs
    };

    // Upload images and get their URLs
    if (selectedImagesArray.length > 0) {
        try {
            const uploadedURLs = await uploadFiles(selectedImagesArray);
            formData.images.push(...uploadedURLs);
            await sendFormData(formData); // Send the form data to the server
            alert("Product added successfully!");

            closeModal(); // Close the modal
        } catch (error) {
            console.error("Error:", error);
            alert("Error adding product. Please try again.");
        }
    } else {
        console.log("No images selected.");
        alert("Please select at least one image.");
    }
});

// Function to upload files and return their URLs
async function uploadFiles(files) {
    const uploadedURLs = [];
    for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/upload-image", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (data.url) {
            uploadedURLs.push(data.url);
        }
    }
    return uploadedURLs;
}

// Function to send form data to the server
async function sendFormData(formData) {
    const response = await fetch("/add-product2", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    const data = await response.json();
    console.log("Success:", data);
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById("addProductWindow"); // Replace "addProductWindow" with your modal's ID
    if (modal) {
        modal.style.display = "none";
    }
}

// =================== 🏁🏁🏁 Section Adding product Finished 🏁🏁🏁 =================== \\
//🔲
//🔲
//🔲
//🔲
//🔲
//🔲
//🔲
//🔲
// =================== 🚀🚀🚀 Orders Section Start 🚀🚀🚀 =================== \\


// Function to fetch and display orders
function displayOrders(filter = "All Orders") {
    const ordersSection = document.getElementById("orders-section");

    // Set the initial HTML structure for the orders section
    ordersSection.innerHTML = `
        <h1>Orders</h1>
        <div class="tab-container">
            <div class="tab-buttons">
                <button class="tab-button ${filter === "All Orders" ? "active" : ""}" data-filter="All Orders">All Orders</button>
                <button class="tab-button ${filter === "Pending" ? "active" : ""}" data-filter="Pending">Pending</button>
                <button class="tab-button ${filter === "In Progress" ? "active" : ""}" data-filter="Pending">In Progress</button>
                <button class="tab-button ${filter === "Delivered" ? "active" : ""}" data-filter="Delivered">Delivered</button>
                <button class="tab-button ${filter === "Cancelled" ? "active" : ""}" data-filter="Cancelled">Cancelled</button>
            </div>
        </div>
        <div class="order-list"></div> <!-- Add the order-list container -->
    `;

    const orderList = ordersSection.querySelector(".order-list");

    // Fetch orders from the server
    fetch("/orders")
        .then(response => response.json())
        .then(orders => {
            if (orders.length > 0) {
                ordersSection.style.display = "block";
            }

            // Clear existing orders
            orderList.innerHTML = "";

            // Filter orders based on the selected filter
            const filteredOrders = orders.filter(order =>
                filter === "All Orders" || order.status === filter
            );

            // Loop through each order and generate HTML
            filteredOrders.forEach(order => {
                const productNames = order.items.map(item => `- ${item.product_name}`).join('<br>');
                const productImages = order.items.map(item => item.image || "placeholder.jpg"); // Fallback for missing images
                const statusClass = `status-${order.status.toLowerCase().replace(' ', '-')}`;

                const orderHTML = `
                    <div class="order_product">
                        <div class="swiper-container">
                            <div class="swiper-wrapper">
                                ${productImages.map(img => `<div class="swiper-slide"><img src="${img}" alt="Product Image"></div>`).join('')}
                            </div>
                            <div class="swiper-pagination"></div>
                        </div>
                        <div class="order_texts">
                            <p><i class="fas fa-tag"></i> Product/s Name:</p>
                            <div class="product-names-container">
                                <span class="product-names">${productNames}</span>
                            </div>
                            <p><i class="fa-solid fa-user"></i> Customer Name: <span>${order.user_name}</span></p>
                            <p><i class="fa-solid fa-map-marker-alt"></i> Address: <span>${order.user_address}</span></p>
                            <p><i class="fa-solid fa-calendar"></i> Order Date: 
                                <span>${new Date(order.order_date).toLocaleDateString()} ${new Date(order.order_date).toLocaleTimeString()}</span>
                            </p>
                            <p><i class="fas fa-cubes"></i> Quantity: <span>${order.items.reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0)}</span></p>
                            <p><i class="fas fa-dollar-sign"></i> Total Price: <span>₪${order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}</span></p>
                            <p><i class="fas fa-barcode"></i> Order Id: <span>#${order.order_id}</span></p>
                        </div>
                        <div class="status">
                            <div class="status-dropdown">
                                <span class="current-status ${statusClass}">${order.status || 'Pending'}</span>
                                <div class="dropdown-content">
                                    <p data-order-id="${order.order_id}" data-status="Pending">Pending</p>
                                    <p data-order-id="${order.order_id}" data-status="In Progress">In Progress</p>
                                    <p data-order-id="${order.order_id}" data-status="Delivered">Delivered</p>
                                    <p data-order-id="${order.order_id}" data-status="Cancelled">Cancelled</p>
                                </div>
                            </div>
                        </div>
                        <div class="contact">
                            <p><i class="fa-solid fa-envelope"></i> Email: <span>${order.user_email}</span></p>
                            <p><i class="fa-solid fa-phone"></i> Phone: <span>${order.user_phone}</span></p>
                        </div>
                    </div>
                `;

                // Append the order HTML to the order list
                orderList.innerHTML += orderHTML;
            });

            // Initialize Swiper after all orders are added
            const swiperContainers = document.querySelectorAll(".swiper-container");
            swiperContainers.forEach(container => {
                const images = container.querySelectorAll("img");
                let loadedCount = 0;

                images.forEach(img => {
                    img.addEventListener("load", () => {
                        loadedCount++;
                        if (loadedCount === images.length) {
                            new Swiper(container, {
                                loop: true,
                                pagination: {
                                    el: ".swiper-pagination",
                                    clickable: true,
                                },
                                navigation: {
                                    nextEl: ".swiper-button-next",
                                    prevEl: ".swiper-button-prev",
                                },
                            });
                        }
                    });

                    // Handle image loading errors
                    img.addEventListener("error", () => {
                        img.src = "placeholder.jpg"; // Fallback to placeholder image
                        loadedCount++;
                        if (loadedCount === images.length) {
                            new Swiper(container, {
                                loop: true,
                                pagination: {
                                    el: ".swiper-pagination",
                                    clickable: true,
                                },
                                navigation: {
                                    nextEl: ".swiper-button-next",
                                    prevEl: ".swiper-button-prev",
                                },
                            });
                        }
                    });
                });
            });
        })
        .catch(error => console.error("Error fetching orders:", error));

    // Add event listeners to tab buttons after rendering the HTML
    const tabButtons = ordersSection.querySelectorAll(".tab-button");
    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedFilter = button.getAttribute("data-filter");
            displayOrders(selectedFilter); // Call displayOrders with the selected filter
        });
    });
}

// Call the function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    displayOrders("All Orders"); // Initial call to display all orders
});




















// document.getElementById("addProductForm").addEventListener("submit", function (event) {
//     event.preventDefault(); // Prevent the default form submission

//     // Collect form data
//     const formData = {
//         name: document.getElementById("productName").value,
//         price: parseFloat(document.getElementById("productPrice").value),
//         description: document.getElementById("productDescription").value,
//         quantity: parseInt(document.getElementById("productQuantity").value),
//         discount: parseFloat(document.getElementById("productDisPrice").value) || 0,
//         type: document.getElementById("productType").value,
//         images: [] // Will be populated with image URLs or files
//     };

//     // Handle main image URL
//     const mainImageUrl = document.getElementById("productImageUrlMain").value;
//     if (mainImageUrl) {
//         formData.images.push(mainImageUrl);
//     }

//     // Handle additional image URLs from selectedUrls array
//     if (selectedUrls.length > 0) {
//         formData.images.push(...selectedUrls); // Add all URLs from selectedUrls
//     }

//     console.log("Selected URLs:", selectedUrls); // Debugging line
//     console.log("Form Data Before File Uploads:", formData); // Debugging line

//     // Handle file uploads
//     const mainImageFile = document.getElementById("productImageMain").files[0];
//     const additionalImageFiles = document.getElementById("productImages").files;

//     // Function to handle file uploads (if needed)
//     const uploadFiles = async (files) => {
//         const uploadedUrls = [];
//         for (const file of files) {
//             const formData = new FormData();
//             formData.append("file", file);

//             const response = await fetch("/upload-image", {
//                 method: "POST",
//                 body: formData
//             });
//             const data = await response.json();
//             if (data.url) {
//                 uploadedUrls.push(data.url);
//             }
//         }
//         return uploadedUrls;
//     };

//     // Upload files and add URLs to formData.images
//     if (mainImageFile || additionalImageFiles.length > 0) {
//         const files = [];
//         if (mainImageFile) files.push(mainImageFile);
//         if (additionalImageFiles.length > 0) files.push(...additionalImageFiles);

//         uploadFiles(files)
//             .then(uploadedUrls => {
//                 formData.images.push(...uploadedUrls);
//                 sendFormData(formData);
//             })
//             .catch(error => {
//                 console.error("Error uploading files:", error);
//                 alert("Error uploading images. Please try again.");
//             });
//     } else {
//         sendFormData(formData);
//     }

//     selectedUrls = []; // Clear the selectedUrls array after submission
// });

// // Function to create an image preview for the main image
// function createUrlImagePreviewMain(src) {
//     const imgWrapper = document.createElement('div');
//     imgWrapper.classList.add('image-wrapper');

//     const imgElement = document.createElement('img');
//     imgElement.src = src;
//     imgElement.classList.add('preview-image');

//     imgWrapper.appendChild(imgElement);
//     return imgWrapper;
// }

// function updateMainImagePreview() {
//     const mainImageUrl = document.getElementById("productImageUrlMain").value;
//     const mainImagePreviewContainer = document.getElementById("mainImagePreviewContainer");

//     mainImagePreviewContainer.innerHTML = "";

//     if (mainImageUrl) {
//         const imgWrapper = createUrlImagePreviewMain(mainImageUrl);
//         mainImagePreviewContainer.prepend(imgWrapper);
//     }

// }

// let selectedUrls = []; // Array to store all image URLs

// // Function to update the additional image previews
// function updateAdditionalImagePreview() {
//     const urlInput = document.getElementById("productImageUrl").value;
//     const imagePreviewContainer = document.getElementById("imagePreviewContainer");

//     // Clear the input field after processing
//     document.getElementById("productImageUrl").value = "";

//     if (urlInput) {
//         selectedUrls.push(urlInput); // Add the new URL to the array
//     }

//     // Clear the container before re-rendering
//     imagePreviewContainer.innerHTML = "";

//     // Render all images in the selectedUrls array
//     selectedUrls.forEach((imageUrl, index) => {
//         const imagePreviewHTML = `
//             <div class="image-wrapper" data-index="${index}">
//                 <div class="remove_image">
//                     <i class="fa-solid fa-trash-can"></i>
//                 </div>
//                 <img src="${imageUrl}" class="preview-image">
//             </div>
//         `;
//         imagePreviewContainer.innerHTML += imagePreviewHTML; // Append the new preview
//     });
// }

// // Function to remove an image
// function removeImage(index) {

//     selectedUrls.splice(index, 1); // Remove the image URL from the array
//     updateAdditionalImagePreview(); // Re-render the previews
// }

// // Add event delegation for remove buttons
// document.getElementById("imagePreviewContainer").addEventListener("click", function (event) {
//     const removeButton = event.target.closest(".remove_image");
//     if (removeButton) {
//         const imageWrapper = removeButton.closest(".image-wrapper");
//         const index = parseInt(imageWrapper.getAttribute("data-index")); // Get the index from the data attribute
//         removeImage(index); // Call the remove function
//     }
// });

// // Add event listeners
// document.getElementById("productImageUrl").addEventListener("input", updateAdditionalImagePreview);

// document.getElementById("productImageUrlMain").addEventListener("input", updateMainImagePreview);



// function sendFormData(formData) {
//     fetch("/add-product", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(formData)
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log("Success:", data);
//             alert("Product added successfully!");
//             closeModal(); // Close the modal after successful submission
//         })
//         .catch(error => {
//             console.error("Error:", error);
//             alert("Error adding product. Please try again.");
//         });
// }

// Function to close the modal


// function closeModal() {
//     document.getElementById("addProductModal").style.display = "none";
// }

// Function to handle dropdown selection
// function selectType(type) {
//     document.getElementById("productType").value = type;
//     toggleDropdown();
// }

// // Function to toggle dropdown visibility
// function toggleDropdown() {
//     const dropdownList = document.getElementById("dropdownList");
//     dropdownList.style.display = dropdownList.style.display === "block" ? "none" : "block";
// }

// // Close the modal when clicking the close button
// document.querySelector(".close").addEventListener("click", closeModal);

// // Close the modal when clicking outside of it
// window.addEventListener("click", function (event) {
//     const modal = document.getElementById("addProductModal");
//     if (event.target === modal) {
//         closeModal();
//     }
// });
