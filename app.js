const fs = require('fs');
const express = require('express');
const multer = require('multer');
const upload = multer({
  dest: 'uploads/',
});

const app = express();

app.use('/', express.static('public'));

const io = require('./io');
app.post('/', upload.single('file-to-upload'), async (req, res) => {
  const { file } = req;
  const entries = io.readFile(file.path);
  await io.writeFile(entries, 'public/out.docx');
  fs.unlinkSync(file.path);
  res.redirect('/out.docx');
});

app.use(function(err, req, res, next) {
  console.log('GOT ERROR===========');
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).send('ERROR');
});

app.listen(process.env.PORT || 3000);
