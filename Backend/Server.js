require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const ngrok = require('@ngrok/ngrok');

// 1. MANUAL CORS - FAILSAFE
// 1. MANUAL CORS - FAILSAFE
app.use((req, res, next) => {
    // Reflect origin to support credentials if needed
    const origin = req.headers.origin;
    if (origin) {
        res.header("Access-Control-Allow-Origin", origin);
    } else {
        res.header("Access-Control-Allow-Origin", "*");
    }

    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, ngrok-skip-browser-warning");
    res.header("Access-Control-Allow-Credentials", "true");

    // Explicitly handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).send();
    }
    next();
});

// DEBUG LOGGING
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require('./Model');

function actualizarDB() {
    db.sequelize.sync({ alter: true })
        .then(() => {
            console.log("\n✅ Database schema updated successfully!\n");
        })
        .catch(err => {
            console.error("\n❌ CRITICAL DATABASE ERROR:", err.message);
            // Non-zero exit code to alert process managers
            // process.exit(1);
        });
}

function eliminarDB() {
    db.sequelize.sync({ force: true }).then(() => {
        console.log("Drop and re-sync db");
    });
}

actualizarDB();

//eliminarDB();





require('./Route/RouteIndex')(app);

app.get('/', (req, res) => {
    res.json('Hello world!');
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    // Only use ngrok in development
    if (process.env.NODE_ENV !== 'production') {
        try {
            const listener = await ngrok.connect({ addr: PORT, authtoken_from_env: true });
            console.log('\n========================================');
            console.log(' NGROK URL:', listener.url());
            console.log('========================================\n');
            console.log('Copy this URL to your frontend service!');
        } catch (error) {
            console.error('Error connecting to ngrok:', error);
        }
    }
});




