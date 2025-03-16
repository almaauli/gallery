const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Koneksi ke MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Ganti dengan password yang sesuai
    database: 'gallery_db'
});

// Tes koneksi ke database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Menggunakan timestamp sebagai nama file
    }
});
const upload = multer({ storage });

// Mendapatkan daftar foto
// Mendapatkan daftar foto berdasarkan user_id
app.get('/photos', (req, res) => {
    const userId = req.query.user_id; // Pastikan untuk mengambil user_id
    const sql = userId ? 'SELECT * FROM photos WHERE user_id = ?' : 'SELECT * FROM photos';
    const params = userId ? [userId] : [];
    
    db.query(sql, params, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

app.get('/photos/:id', (req, res) => {
    const photoId = req.params.id;
  
    db.query('SELECT * FROM photos WHERE id = ?', [photoId], (err, results) => {
      if (err) {
        return res.status(500).send({ error: 'Database error' });
      }
      if (results.length === 0) {
        return res.status(404).send({ error: 'Photo not found' });
      }
      res.json(results[0]); // Mengirimkan data foto pertama
    });
  });

  
  

// API untuk mengunggah foto dengan file
app.post('/photos/upload', upload.single('photo'), (req, res) => {
    const { title, user_id, is_public } = req.body;
    const filePath = `http://localhost:${port}/uploads/${req.file.filename}`;

    // Validasi user_id
    const checkUserSql = 'SELECT * FROM users WHERE id = ?';
    db.query(checkUserSql, [user_id], (err, userResults) => {
        if (err) {
            console.error('Error while checking user:', err.message);
            return res.status(500).json({ error: err.message });
        }
        if (userResults.length === 0) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Jika user_id valid, lanjutkan untuk menyimpan foto
        const sql = 'INSERT INTO photos (user_id, title, url, is_public, uploaded_at) VALUES (?, ?, ?, ?, NOW())';
        db.query(sql, [user_id, title, filePath, is_public === 'true'], (err, result) => {
            if (err) {
                console.error('Error while uploading photo:', err.message);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: result.insertId, message: 'Photo uploaded successfully.' });
        });
    });
});



// API untuk menambah foto berdasarkan URL
app.post('/photos', (req, res) => {
    const { title, url, user_id, is_public } = req.body;

    // Validasi user_id
    const checkUserSql = 'SELECT * FROM users WHERE id = ?';
    db.query(checkUserSql, [user_id], (err, userResults) => {
        if (err) {
            console.error('Error while checking user:', err.message);
            return res.status(500).json({ error: err.message });
        }
        if (userResults.length === 0) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Jika user_id valid, lanjutkan untuk menyimpan foto
        const sql = 'INSERT INTO photos (user_id, title, url, is_public, uploaded_at) VALUES (?, ?, ?, ?, NOW())';
        db.query(sql, [user_id, title, url, is_public === 'true'], (err, result) => {
            if (err) {
                console.error('Error while adding photo:', err.message);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: result.insertId, message: 'Photo added successfully.' });
        });
    });
});


// Endpoint untuk menghapus foto
app.delete('/photos/:id', (req, res) => {
    const photoId = req.params.id;
    const sql = 'DELETE FROM photos WHERE id = ?';
    db.query(sql, [photoId], (err, result) => {
        if (err) {
            console.error('Error while deleting photo:', err.message);
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Photo not found' });
        }
        res.json({ message: 'Photo deleted successfully.' });
    });
});

// Endpoint untuk memperbarui foto
app.put('/photos/:id', (req, res) => {
    const photoId = req.params.id;
    const updatedPhoto = req.body;
  
    const sql = 'UPDATE photos SET title = ?, url = ?, is_public = ? WHERE id = ?';
    db.query(sql, [updatedPhoto.title, updatedPhoto.url, updatedPhoto.is_public, photoId], (err, result) => {
        if (err) {
            console.error('Error updating photo:', err.message);
            return res.status(500).send('Error updating photo');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Photo not found');
        }
        res.send('Photo updated successfully');
    });
});


// Endpoint untuk registrasi
app.post('/register', (req, res) => {
    const { username, password } = req.body; // Ambil data dari request body
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId, message: 'User registered successfully.' });
    });
});

// Endpoint untuk login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({ userId: results[0].id });
    });
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
