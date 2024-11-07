const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 5000;

// Enable CORS so frontend can access the backend
app.use(cors());
app.use(express.json()); // For parsing JSON request bodies

// Connect to SQLite database
const db = new sqlite3.Database("./flights.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

// Define the endpoint to get all flights data
app.get("/api/flights", (req, res) => {
    db.all("SELECT * FROM flights", [], (err, rows) => {
        if (err) {
            console.error("Error fetching flights data:", err.message);
            res.status(500).json({ error: "Failed to retrieve flights data" });
        } else {
            res.json(rows);
        }
    });
});

// Define the endpoint to get filtered flights data based on query parameters
app.get("/api/flights/filter", (req, res) => {
    const { departure_airport, arrival_airport, departure_date, arrival_date } = req.query;
    
    let query = "SELECT * FROM flights WHERE 1=1";
    const params = [];

    if (departure_airport) {
        query += " AND departure_airport = ?";
        params.push(departure_airport);
    }
    if (arrival_airport) {
        query += " AND arrival_airport = ?";
        params.push(arrival_airport);
    }
    if (departure_date) {
        query += " AND departure_date LIKE ?";
        params.push(`${departure_date}%`); // Matches the date part
    }
    if (arrival_date) {
        query += " AND arrival_date LIKE ?";
        params.push(`${arrival_date}%`); // Matches the date part
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error("Error fetching filtered flights data:", err.message);
            res.status(500).json({ error: "Failed to retrieve filtered flights data" });
        } else {
            res.json(rows);
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
