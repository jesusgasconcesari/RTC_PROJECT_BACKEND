//nos traemos el modulo mongoose
const mongoose = require('mongoose');

//creamos una funcion asincrona


const connectDB = async () => {
    try {
        console.log("DB_URL:", process.env.DB_URL);
        await mongoose.connect(process.env.DB_URL);
        console.log("Conectado con éxito a la base de datos");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
    }
}

//exportamos la funcion para usarla en otros archivos

module.exports = { connectDB };