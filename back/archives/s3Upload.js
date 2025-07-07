const { PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const s3Client = require('../services/s3Client'); // <-- on utilise le client ici
require('dotenv').config({ path: './config/.env' });

const uploadLocal = multer({ dest: 'uploads/' });

const uploadToS3 = async (file, dossier = '') => {
  const fileContent = fs.readFileSync(file.path);
  const key = `${dossier}/${Date.now()}-${file.originalname}`.replace(/\/+/g, '/');

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: fileContent,
  });

  await s3Client.send(command);
  fs.unlinkSync(file.path); // nettoyage du fichier temporaire
  return key;
};

module.exports = { uploadLocal, uploadToS3 };
