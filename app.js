const express = require("express");
const app = express();
const mysql = require("mysql2");
const path = require('path');
const multer = require("multer"); // Import multer


const port = process.env.PORT || 1001;
const BASE_URL = process.env.BASE_URL || ""; // Define a base URL from env variables


// Using connection connectioning
const connection = mysql.createPool({
    host: process.env.DB_HOST,  // Set by Render
    user: process.env.DB_USER,  // Set by Render
    password: process.env.DB_PASSWORD,  // Set by Render
    database: process.env.DB_NAME,  // Set by Render
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
     connectTimeout: 10000
});

// Check connection
connection.getConnection((err, connection) => {
    if (err) {
        console.log("Error connection: ", err.stack);
        return;
    } else {
        console.log("Connected to the database!");
        connection.release(); // Release connection back to connection
    }
});

// Example endpoint to fetch products
app.get('/products', (req, res) => {
    connection.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).json({ error: 'Error fetching products' });
        }
        res.json(results);
    });
});


app.use(express.json());


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); // Save files in the 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Rename files to avoid conflicts
    }
});

const upload = multer({ storage: storage });

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Endpoint to handle file uploads
app.post("/upload-image", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // Determine the correct base URL
    const baseUrl = BASE_URL || `${req.protocol}://${req.get("host")}`; // Use env variable if available
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.json({ url: fileUrl });
});



// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Optional: Explicitly serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});




app.get("/products", (req, res) => {
    const sql = `
        SELECT 
            p.id, 
            p.name, 
            p.price, 
            p.discount,
            p.description, 
            p.quantity, 
            p.sales_count, 
            GROUP_CONCAT(pi.image_url) AS images 
        FROM 
            products p
        LEFT JOIN 
            product_images pi 
        ON 
            p.id = pi.product_id
        GROUP BY 
            p.id;
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching products, ", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }

        // Convert the comma-separated string into an array
        results.forEach(product => {
            if (product.images) {
                product.images = product.images.split(','); // Split the string into an array
            } else {
                product.images = []; // If no images, set to an empty array
            }
        });

        res.json(results);
    });
});

app.get("/product/:id", (req, res) => {
    const productId = req.params.id;

    const sql = `
              SELECT 
    p.id, 
    p.name, 
    p.price, 
    p.discount,
    p.description, 
    p.quantity, 
    p.sales_count, 
    COALESCE(pt.id, 0) AS product_type_id,  -- Return the ID of the product type
    COALESCE(pt.name, 'Uncategorized') AS product_type_name,  -- Optional: Return the name for debugging
    GROUP_CONCAT(pi.image_url) AS images
FROM 
    products p
LEFT JOIN 
    product_images pi ON p.id = pi.product_id
LEFT JOIN 
    product_types pt ON p.type_id = pt.id
WHERE 
    p.id = ?
GROUP BY 
    p.id;

    `;

    connection.query(sql, [productId], (err, results) => {
        if (err) {
            console.error("Error fetching product, ", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        let product = results[0];  // Extract the first object

        // Convert the comma-separated string into an array
        product.images = product.images ? product.images.split(',') : [];

        res.json(product);  // Return only the first product object
    });
});



app.get("/newest10Product", (req, res) => {

    const sql = `
    SELECT 
        p.id, 
        p.name, 
        p.price, 
        p.discount,
        p.description, 
        p.quantity, 
        p.sales_count, 
        GROUP_CONCAT(pi.image_url) AS images 
    FROM 
        products p
    LEFT JOIN 
        product_images pi 
    ON 
        p.id = pi.product_id
    GROUP BY 
        p.id

        ORDER BY p.created_at DESC 
        LIMIT 10;;

`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching 10 products, ", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }

        results.forEach(product => {
            if (product.images) {
                product.images = product.images.split(',');
            } else {
                product.images = [];
            }
        });

        res.json(results);
    })
})

// Insert product and images into the database
app.post("/add-product", (req, res) => {
    const { name, price, description, quantity, discount, type, images } = req.body;

    if (!name || !price || !quantity || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ error: "Invalid request. Ensure all fields are provided, including images." });
    }

    // Insert the product first
    const productQuery = `INSERT INTO products (name, price, discount, description, quantity, type) VALUES (?, ?, ?, ?, ?, ?)`;

    connection.query(productQuery, [name, price, discount ? discount : 0, description, quantity, type], (err, result) => {
        if (err) {
            console.error("Error inserting product:", err);
            return res.status(500).json({ error: "Error inserting product" });
        }

        const productId = result.insertId; // Get the newly inserted product ID
        console.log(`✅ Product inserted with ID: ${productId}`);

        // Insert images into product_images table
        const imageQueries = images.map(imageUrl => {
            return new Promise((resolve, reject) => {
                const imageQuery = `INSERT INTO product_images (product_id, image_url) VALUES (?, ?)`;
                connection.query(imageQuery, [productId, imageUrl], (imgErr, imgResult) => {
                    if (imgErr) {
                        console.error("❌ Error inserting image:", imgErr);
                        reject(imgErr);
                    } else {
                        console.log(`✅ Image inserted for product ${productId}: ${imageUrl}`);
                        resolve(imgResult);
                    }
                });
            });
        });

        // Execute all image insertions
        Promise.all(imageQueries)
            .then(() => {
                console.log("✅ All images inserted successfully.");
                res.json({ message: "Product and images added successfully!" });
            })
            .catch((imgErr) => {
                console.error("❌ Error inserting product images:", imgErr);
                res.status(500).json({ error: "Error inserting product images" });
            });
    });
});

app.post("/add-product2", (req, res) => {
    const { name, price, description, quantity, discount, type_id, images } = req.body;

    if (!name || !price || !quantity || !Array.isArray(images) || images.length === 0 || !type_id) {
        return res.status(400).json({ error: "Invalid request. Ensure all fields are provided, including images and product type." });
    }

    // Insert the product with type_id
    const productQuery = `INSERT INTO products (name, price, discount, description, quantity, type_id) VALUES (?, ?, ?, ?, ?, ?)`;

    connection.query(productQuery, [name, price, discount || 0, description, quantity, type_id], (err, result) => {
        if (err) {
            console.error("Error inserting product:", err);
            return res.status(500).json({ error: "Error inserting product" });
        }

        const productId = result.insertId; // Get the newly inserted product ID
        console.log(`✅ Product inserted with ID: ${productId}`);

        // Insert images into product_images table
        const imageQueries = images.map(imageUrl => {
            return new Promise((resolve, reject) => {
                const imageQuery = `INSERT INTO product_images (product_id, image_url) VALUES (?, ?)`;
                connection.query(imageQuery, [productId, imageUrl], (imgErr, imgResult) => {
                    if (imgErr) {
                        console.error("❌ Error inserting image:", imgErr);
                        reject(imgErr);
                    } else {
                        console.log(`✅ Image inserted for product ${productId}: ${imageUrl}`);
                        resolve(imgResult);
                    }
                });
            });
        });

        // Execute all image insertions
        Promise.all(imageQueries)
            .then(() => {
                console.log("✅ All images inserted successfully.");
                res.json({ message: "Product and images added successfully!" });
            })
            .catch((imgErr) => {
                console.error("❌ Error inserting product images:", imgErr);
                res.status(500).json({ error: "Error inserting product images" });
            });
    });
});

app.put("/updateProduct/:id", (req, res) => {
    const productId = req.params.id;
    const { name, price, discount, description, quantity, sales_count, type_id, images } = req.body;

    // Step 1: Build the dynamic UPDATE query for the products table
    let updateFields = [];
    let updateValues = [];

    if (name !== undefined) {
        updateFields.push("name = ?");
        updateValues.push(name);
    }
    if (price !== undefined) {
        updateFields.push("price = ?");
        updateValues.push(price);
    }
    if (discount !== undefined) {
        updateFields.push("discount = ?");
        updateValues.push(discount);
    }
    if (description !== undefined) {
        updateFields.push("description = ?");
        updateValues.push(description);
    }
    if (quantity !== undefined) {
        updateFields.push("quantity = ?");
        updateValues.push(quantity);
    }
    if (sales_count !== undefined) {
        updateFields.push("sales_count = ?");
        updateValues.push(sales_count);
    }
    if (type_id !== undefined) {
        updateFields.push("type_id = ?");
        updateValues.push(type_id);
    }

    // If no fields are provided to update, return an error
    if (updateFields.length === 0 && images === undefined) {
        return res.status(400).json({ message: "No fields provided for update" });
    }

    // Add the productId to the values array for the WHERE clause
    updateValues.push(productId);

    // Step 2: Start a transaction
    connection.beginTransaction((err) => {
        if (err) {
            console.error("Error starting transaction: ", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }

        // Step 3: Update the product details (if any fields are provided)
        if (updateFields.length > 0) {
            const updateProductSql = `
                UPDATE products
                SET ${updateFields.join(", ")}
                WHERE id = ?;
            `;

            connection.query(updateProductSql, updateValues, (err, results) => {
                if (err) {
                    return connection.rollback(() => {
                        console.error("Error updating product: ", err);
                        res.status(500).json({ message: "Internal Server Error" });
                    });
                }

                if (results.affectedRows === 0) {
                    return connection.rollback(() => {
                        res.status(404).json({ message: "Product not found" });
                    });
                }

                // Proceed to handle images
                handleImages();
            });
        } else {
            // No product fields to update, proceed to handle images
            handleImages();
        }
    });

    // Function to handle image updates
    function handleImages() {
        if (images !== undefined) {
            // Step 4: Insert new images (if any)
            if (images.length > 0) {
                const insertImagesSql = `
                    INSERT INTO product_images (product_id, image_url)
                    VALUES ?;
                `;

                const imageValues = images.map((imageUrl) => [productId, imageUrl]);

                connection.query(insertImagesSql, [imageValues], (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            console.error("Error inserting images: ", err);
                            res.status(500).json({ message: "Internal Server Error" });
                        });
                    }

                    // Commit the transaction
                    connection.commit((err) => {
                        if (err) {
                            return connection.rollback(() => {
                                console.error("Error committing transaction: ", err);
                                res.status(500).json({ message: "Internal Server Error" });
                            });
                        }

                        res.json({ message: "Product and images updated successfully" });
                    });
                });
            } else {
                // No images to insert, just commit the transaction
                connection.commit((err) => {
                    if (err) {
                        return connection.rollback(() => {
                            console.error("Error committing transaction: ", err);
                            res.status(500).json({ message: "Internal Server Error" });
                        });
                    }

                    res.json({ message: "Product updated successfully (no images)" });
                });
            }
        } else {
            // No images provided, just commit the transaction
            connection.commit((err) => {
                if (err) {
                    return connection.rollback(() => {
                        console.error("Error committing transaction: ", err);
                        res.status(500).json({ message: "Internal Server Error" });
                    });
                }

                res.json({ message: "Product updated successfully" });
            });
        }
    }
});


app.get('/productDetails', (req, res) => {
    const productId = req.query.id;

    const sql = `
        SELECT 
            p.id, 
            p.name, 
            p.price, 
            p.discount,
            p.description, 
            p.quantity, 
            GROUP_CONCAT(pi.image_url) AS images 
        FROM 
            products p
        LEFT JOIN 
            product_images pi 
        ON 
            p.id = pi.product_id
        WHERE 
            p.id = ?
        GROUP BY 
            p.id;
    `;

    connection.query(sql, [productId], (err, results) => {
        if (err) {
            console.error("Error fetching product details: ", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        if (results.length > 0) {
            const product = results[0];
            product.images = product.images ? product.images.split(',') : [];
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    });
});

app.get('/productTypes', (req, res) => {  // ✅ Corrected order
    const sql = `SELECT * FROM product_types;`;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching all Product Types: ", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.json(results);  // ✅ No need for Object.values()
    });
});




// ---------------- ORDERS ---------------------

app.get("/orders/:order_id", (req, res) => {
    const orderId = req.params.order_id;
    const sql = `
    SELECT 
        o.id AS order_id,
        o.user_name,
        o.user_email,
        o.user_phone,
        o.user_address,
        o.order_date,
        o.status,
        oi.product_id,
        p.name AS product_name,
        oi.quantity,
        p.price
    FROM 
        orders o
    JOIN 
        order_items oi ON o.id = oi.order_id
    JOIN 
        products p ON oi.product_id = p.id
    WHERE 
             o.id = ?;
    `;

    connection.query(sql, [orderId], (err, results) => {
        if (err) {
            console.error("Error fetching orders: ", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.json(results)
    })
})

/*
SELECT 
    o.id as order_id,
    o.user_name,
    o.user_email,
    o.user_email,
    o.order_date,
    o.status,
    oi.product_id,
    p.name as product_name,
    p.main_img,
    oi.quantity,
    p.price
    
        FROM
            orders o
            JOIN order_items oi on o.id = oi.order_id
                JOIN products p on oi.product_id = p.id
                
                
*/


app.get("/orders", (req, res) => {
    const sql = `
        SELECT 
        o.id AS order_id,
        o.user_name,
        o.user_email,
        o.user_phone,
        o.user_address,
        o.order_date,
        o.status,
        oi.product_id,
        p.name AS product_name,
        oi.quantity,
        p.price,
        (SELECT pi.image_url 
        FROM product_images pi 
        WHERE pi.product_id = p.id 
        ORDER BY pi.id ASC 
        LIMIT 1) AS product_image -- Get the first image for each product
    FROM 
        orders o
    JOIN 
        order_items oi ON o.id = oi.order_id
    JOIN 
        products p ON oi.product_id = p.id;
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching all orders: ", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }

        // Group order items by order ID
        const orders = results.reduce((acc, row) => {
            if (!acc[row.order_id]) {
                acc[row.order_id] = {
                    order_id: row.order_id,
                    user_name: row.user_name,
                    user_email: row.user_email,
                    user_phone: row.user_phone,
                    user_address: row.user_address,
                    order_date: row.order_date,
                    status: row.status,
                    items: []
                };
            }

            if (row.product_id) {
                acc[row.order_id].items.push({
                    product_id: row.product_id,
                    product_name: row.product_name,
                    image: row.product_image,
                    quantity: row.quantity,
                    price: row.price
                });
            }

            return acc;
        }, {});

        res.json(Object.values(orders));
    });
});


app.get("/ordersCount", (req, res) => {

    const sql = `
       SELECT 
            status, 
            COUNT(*) AS status_count
        FROM 
            orders
        WHERE 
            status IN ('Delivered', 'Pending', 'Cancelled', 'In Progress')
        GROUP BY 
            status; 
    `;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching all orders: ", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }

        const statusData = {
            labels: [],
            data: []
        };

        results.forEach(row => {
            statusData.labels.push(row.status);
            statusData.data.push(row.status_count);
        });
        res.json(statusData);

    });

});

app.get("/pendingOrdersCount", (req, res) => {
    const sql = `
        SELECT 
            COUNT(*) AS pending_count
        FROM 
            orders
        WHERE 
            status = 'Pending';
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching pending orders count: ", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }

        const pendingCount = results[0].pending_count;
        res.json({ pendingCount });
    });
});


app.get("/getLatestOrders", (req, res) => {
    const sql = `
        SELECT 
            id, 
            user_name, 
            user_email, 
            user_phone, 
            user_address, 
            order_date, 
            status
        FROM 
            orders
        ORDER BY 
            order_date DESC
        LIMIT 6;
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching latest orders: ", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.json(results);
    });
});


// Route to add an order with order items
app.post("/add-order", (req, res) => {
    const { user_name, user_email, user_phone, user_address, order_date, status, items } = req.body;

    if (!user_name || !user_email || !user_phone || !user_address || !status || !items || !Array.isArray(items)) {
        return res.status(400).json({ message: "Invalid request data" });
    }

    const insertOrderQuery = `INSERT INTO orders (user_name, user_email, user_phone, user_address, order_date, status) VALUES (?, ?, ?, ?, NOW(), ?)`;

    connection.query(insertOrderQuery, [user_name, user_email, user_phone, user_address, status], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error inserting order", error: err });
        }

        const orderId = result.insertId;

        if (items.length === 0) {
            return res.status(201).json({ message: "Order added successfully", orderId });
        }

        const insertItemsQuery = `INSERT INTO order_items (order_id, product_id, quantity) VALUES ?`;
        const orderItemsData = items.map(item => [orderId, item.product_id, item.quantity]);

        connection.query(insertItemsQuery, [orderItemsData], (err) => {
            if (err) {
                return res.status(500).json({ message: "Error inserting order items", error: err });
            }
            res.status(201).json({ message: "Order and items added successfully", orderId });
        });
    });
});


// ---------------------- Cutsomers -----------------

app.get("/customers", (req, res) => {
    const sql = `
                WITH CustomerTotals AS (
            SELECT 
                o.user_name,
                o.user_email,
                o.user_phone,
                SUM(oi.quantity * p.price) AS Total_Purchase_Amount
            FROM 
                orders o
            JOIN 
                order_items oi ON o.id = oi.order_id
            JOIN 
                products p ON oi.product_id = p.id
            GROUP BY 
                o.user_name, o.user_email, o.user_phone
        ),
        PercentileRanks AS (
            SELECT 
                user_name,
                user_email,
                user_phone,
                Total_Purchase_Amount,
                -- Calculate percentile rank (0 to 1)
                PERCENT_RANK() OVER (ORDER BY Total_Purchase_Amount DESC) AS Percentile
            FROM 
                CustomerTotals
        )
        SELECT 
            user_name AS Name,
            user_email AS Email,
            user_phone AS Phone,
            Total_Purchase_Amount,
            CASE
                WHEN Percentile <= 0.05 THEN 'Diamond'
                WHEN Percentile <= 0.20 THEN 'Platinum'
                WHEN Percentile <= 0.50 THEN 'Gold'
                WHEN Percentile <= 0.80 THEN 'Silver'
                ELSE 'Bronze'
            END AS Customer_Tier
        FROM 
            PercentileRanks
        ORDER BY 
            Total_Purchase_Amount DESC;
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.log("Error Fetching customers ", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.json(results);
    })
})




//-===============================
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
