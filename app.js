const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Konfiguracja multer do przesyłania plików
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = req.body.folderName; // Pobieramy nazwę folderu z body żądania
    if (!folderName) {
      return cb(new Error('Nazwa folderu jest wymagana'), null);
    }

    const uploadPath = path.join('uploads', folderName); // Tworzymy ścieżkę do folderu

    console.log('Ścieżka do zapisu:', uploadPath); // Debugowanie

    // Tworzymy folder, jeśli nie istnieje
    if (!fs.existsSync(uploadPath)) {
      console.log('Tworzę folder:', uploadPath); // Debugowanie
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Przekazujemy ścieżkę do multer
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Middleware do obsługi danych z formularzy
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serwowanie plików statycznych z folderu 'uploads'
app.use('/uploads', express.static('uploads'));

// Strona do przesyłania zdjęć
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Endpoint do obsługi przesyłania wielu zdjęć
app.post('/upload', upload.array('images', 20), (req, res) => {
  const folderName = req.body.folderName; // Pobieramy nazwę folderu z body żądania
  if (!folderName) {
    return res.status(400).send('Nazwa folderu jest wymagana');
  }

  console.log(req.files); // Sprawdzamy, jakie pliki zostały przesłane
  if (!req.files) {
    return res.status(400).send('Brak plików');
  }

  // Generowanie linków do przesłanych plików
  const imageUrls = req.files.map(file => {
    return `"http://localhost:3001/uploads/${folderName}/${file.filename}",`;
  });

  res.send(`Zdjęcia zostały przesłane. Linki do zdjęć: <br> ${imageUrls.join('<br>')}`);
});

// Uruchomienie serwera na porcie 3001
app.listen(3001, () => {
  console.log('Serwer działa na http://localhost:3001');
});