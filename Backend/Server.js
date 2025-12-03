const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');


app.use(cors(
    {
        origin: '*',
    }
));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require('./Model');

//db.sequelize.sync();



db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db");
});


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.json('Hello world!');
});


const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




