import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

const dirs = ['uploads/photos', 'uploads/audio', 'uploads/code'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `uploads/${req.params.type}`); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  }
});

const upload = multer({ storage });

app.use('/live', express.static(path.join(__dirname, 'uploads/code')));
app.use('/media', express.static(path.join(__dirname, 'uploads')));

// 🔥 ITHE TUJI WEBHOOK URL TAK 🔥
const SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbweiWX8w0MUGu5IeXTUx-ixHxKuViYXL7TWBMK1un-UIJSqTY5ukJ4JTGcNIsO8XF_U1g/exec"; 

app.post('/upload/:type', upload.single('file'), async (req, res) => {
  // Dynamic host URL (Localhost kiva Live Domain swatah gheil)
  const hostUrl = req.protocol + '://' + req.get('host');
  let liveLink = `${hostUrl}/live/${req.file.originalname}`;
  
  if(req.params.type !== 'code') {
    liveLink = `${hostUrl}/media/${req.params.type}/${req.file.originalname}`;
  }

  if (req.params.type === 'code') {
    const sheetData = {
      indexNo: req.body.indexNo,
      clientName: req.body.clientName,
      mobile: req.body.mobile,
      email: req.body.email,
      address: req.body.address,
      packageName: req.body.packageName,
      totalPayment: req.body.totalPayment,
      websiteLink: liveLink
    };

    try {
      await fetch(SHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sheetData)
      });
      console.log("✅ Google Sheet madhye data save zala!");
    } catch (error) {
      console.error("❌ Google Sheet Error:", error);
    }
  }
  
  res.json({ 
    message: 'Ekdum Kadak! File Save Zali & Sheet Update Zali.', 
    link: liveLink 
  });
});

// 🔥 FINAL WEBSITE SERVE KARNYACHA CODE 🔥
// (Vite ne banavlela 'dist' folder ithe serve hoil)
const distPath = path.join(__dirname, '../../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Port 80 ha default website cha port asto (Cloud sathi)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SHIRYX Pro Server Chalu Jhala! Port: ${PORT}`);
});