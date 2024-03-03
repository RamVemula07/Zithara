const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 8000;


app.use(bodyParser.json());

// Database configuration
const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};

// Function to establish database connection
const pool = new Pool(dbConfig);

// Function to generate dummy data
function generateDummyData() {
    const records = [];
    for (let i = 0; i < 50; i++) {
        const customerName = `Customer ${i + 1}`;
        const age = Math.floor(Math.random() * (80 - 18 + 1)) + 18;
        const phone =` 123456789${i.toString().padStart(2, '0')}`;
        const location = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)];
        records.push({ customerName, age, phone, location });
    }
    return records;
}

// Endpoint to create records with dummy data
app.post('/api/createDummyRecords', async (req, res) => {
    try {
        const dummyData = generateDummyData();

        // Insert dummy records into the database
        await Promise.all(dummyData.map(async (record) => {
            await pool.query(
                'INSERT INTO records (customer_name, age, phone, location) VALUES ($1, $2, $3, $4)',
                [record.customerName, record.age, record.phone, record.location]
            );
        }));

        res.json({ message: 'Dummy records created successfully' });
    } catch (error) {
        console.error('Error creating dummy records:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/records', async (req, res) => {
    try {
        const {rows } = await pool.query('SELECT * FROM records');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});