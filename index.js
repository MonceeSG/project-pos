const express = require("express");
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const authController = require('./controller/authController');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.post('/register', authController.register);
app.post('/login', authController.login);

app.listen(port, () => {
    console.log(`Running on port: ${port}`);
})