require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');


const ngrok = require('@ngrok/ngrok');


app.use(cors({
    origin: (origin, callback) => {
        callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
    exposedHeaders: ['Content-Type'],
    credentials: true
}));

// Necesario para respuestas OPTIONS (preflight)
app.options(/.*/, cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require('./Model');

db.sequelize.sync({ alter: true }).then(() => {
    console.log("Database schema updated successfully");
});


//db.sequelize.sync({ force: true }).then(() => {
//    console.log("Drop and re-sync db");
//});



app.use(express.static(path.join(__dirname, 'public')));

require('./Route/RouteIndex')(app);

app.get('/', (req, res) => {
    res.json('Hello world!');
});


const PORT = 8080;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        const listener = await ngrok.connect({ addr: PORT, authtoken_from_env: true });
        console.log('\n========================================');
        console.log(' NGROK URL:', listener.url());
        console.log('========================================\n');
        console.log('Copy this URL to your frontend service!');
    } catch (error) {
        console.error('Error connecting to ngrok:', error);
    }
});




