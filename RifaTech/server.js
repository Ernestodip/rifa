require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("🟢 Conectado a MongoDB"))
.catch(err => console.error("🔴 Error al conectar a MongoDB", err));

// Modelo de Número Vendido
const NumeroSchema = new mongoose.Schema({
    numero: Number
});
const Numero = mongoose.model("Numero", NumeroSchema);

// Ruta para obtener los números vendidos
app.get("/numeros-vendidos", async (req, res) => {
    const vendidos = await Numero.find();
    res.json(vendidos.map(n => n.numero));
});

// Ruta para marcar un número como vendido
app.post("/vender-numero", async (req, res) => {
    const { numero } = req.body;
    await Numero.create({ numero });
    res.json({ mensaje: "Número vendido" });
});

// Ruta para quitar un número vendido
app.delete("/borrar-numero/:numero", async (req, res) => {
    await Numero.deleteOne({ numero: req.params.numero });
    res.json({ mensaje: "Número eliminado" });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
