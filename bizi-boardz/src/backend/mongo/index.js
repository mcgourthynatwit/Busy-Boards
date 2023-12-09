const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config();

const app = express()

const db_User = process.env.DB_USER;
const db_Password = process.env.DB_PASSWORD;
mongoose.connect(`mongodb+srv://${db_User}:${db_Password}@biziboardz.bskydq3.mongodb.net/?retryWrites=true&w=majority`);

app.listen(3000, () => {
    console.log('on port 3000')
})

