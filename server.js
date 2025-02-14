const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path'); // Import modułu 'path'
const fs = require('fs');
const multer = require('multer');
// Inicjalizacja aplikacji Express
const app = express();
// Ustawienie katalogu dla plików statycznych
app.use(express.static(path.join(__dirname, 'public')));

// Obsługa głównej ścieżki "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Port dla Render (Render wymaga process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { 
    console.log(`Serwer działa na porcie ${PORT}`)
    
});




// Middleware
app.use(cors({
    origin: "https://mighty-atoll-85630-47ec321ac5af.herokuapp.com", // Zezwól na zapytania z tego adresu 
    methods: ["GET", "POST"], // Zezwól na metody GET i POST
    allowedHeaders: ["Content-Type"], // Zezwól na nagłówek Content-Type
}));
app.use(express.json()); // Parsowanie JSON w treści zapytań

// Połączenie z MongoDB Atlas
const mongoURI = "mongodb+srv://aslupecki:AoVcBJdm2dmL534y@cluster0.w8zj1.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Połączono z MongoDB Atlas'))
    .catch(err => console.error('Błąd połączenia z MongoDB Atlas:', err));

// Model danych dla kontaktu
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
});
const Contact = mongoose.model('Contact', contactSchema);

// Funkcja pomocnicza do generowania daty w formacie dd-mm-yyyy
function getFormattedDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Konfiguracja multer do przesyłania plików
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dateFolder = `uploads/${getFormattedDate()}`;
        // Tworzenie folderu, jeśli nie istnieje
        fs.mkdirSync(dateFolder, { recursive: true });
        cb(null, dateFolder);
    },
    filename: (req, file, cb) => {
        const formattedDate = getFormattedDate();
        const extension = path.extname(file.originalname);
        cb(null, `${formattedDate}-${Date.now()}${extension}`);
    }
});

const upload = multer({ storage: storage });

// Endpoint do zapisu kontaktu
app.post("/submit-contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: "Wszystkie pola są wymagane." });
        }

        const newContact = new Contact({ name, email, message });
        await newContact.save();

        console.log("Dane zapisane pomyślnie!");
        res.status(201).json({ message: "Dane zapisane pomyślnie!" });
    } catch (error) {
        console.error("Błąd podczas zapisywania danych:", error);
        res.status(500).json({ error: "Wystąpił błąd serwera." });
    }
});

// Serwowanie plików statycznych z folderu 'uploads'
app.use(express.static(path.join(__dirname, 'uploads')));

// Endpoint do przesyłania plików
app.post('/upload', upload.array('images', 20), (req, res) => {
    if (!req.files) {
        return res.status(400).send('Brak plików');
    }

    const imageUrls = req.files.map(file => `http://localhost:${port}/uploads/${getFormattedDate()}/${file.filename}`);
    res.send(`Zdjęcia zostały przesłane. Linki do zdjęć: <br> ${imageUrls.join('<br>')}`);
});


