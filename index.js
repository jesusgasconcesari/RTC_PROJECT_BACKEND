require("dotenv").config();

const express = require('express');
const { connectDB } = require('./src/config/db');

const app = express();
connectDB();

app.use(express.json());

app.use("/hola", (req, res) => {
    return res.send("Hola mundo desde Express");
});

const itemRoutes = require('./src/api/routes/item.routes.js');
app.use('/api', itemRoutes);

const userRoutes = require('./src/api/routes/user.routes.js');
app.use('/api/users', userRoutes);

 app.use("/", (req, res, next) => {
    return res.status(404).json("Ruta no encontrada");
 });



app.listen(3000, () => {
    console.log("http://localhost:3000");
});

