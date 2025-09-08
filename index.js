const express = require("express");
const authController = require("./controller/authController");
const authentication = require("./middlewares/authentication");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.post('/login', authController.login);
app.post('/register', authController.register);

app.listen(port, () => {
    console.log(`Running on port: ${port}`);
})