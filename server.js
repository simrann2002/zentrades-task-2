const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up storage using Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Handle file upload and JSON parsing
app.post('/upload', upload.single('productFile'), (req, res) => {
  const filePath = req.file.path;

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('An error occurred while reading the file.');
    }

    try {
      const jsonData = JSON.parse(data);
      const products = Object.values(jsonData.products).sort((a, b) => b.popularity - a.popularity);

      // Send sorted data to the client
      res.json(products);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).send('An error occurred while parsing the file.');
    } finally {
      // Delete the file after processing
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
      });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
