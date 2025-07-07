const express = require('express');
const router = express.Router();
const { uploadLocal, uploadToS3 } = require('../archives/s3Upload');
const { S3Client, ListObjectsV2Command, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3Client = require('../services/s3Client'); // Instance correcte de s3Client
const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'ibrahimadiallo';

// Route d'upload multiple
router.post('/upload-multiple', uploadLocal.array('files'), async (req, res) => {
  try {
    const dossier = req.body.dossier?.trim() || 'uploads';
    const uploadedFiles = [];

    for (const file of req.files) {
      const key = await uploadToS3(file, dossier);
      uploadedFiles.push({ originalName: file.originalname, key });
    }

    res.json({ message: 'Fichiers uploadés avec succès', files: uploadedFiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'upload' });
  }
});

// Route pour lister les dossiers
router.get('/dossiers', async (req, res) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Delimiter: '/',
    });

    const data = await s3Client.send(command);
    const dossiers = data.CommonPrefixes ? data.CommonPrefixes.map(prefix => prefix.Prefix.replace(/\/$/, '')) : [];

    res.json(dossiers);
  } catch (err) {
    console.error('Erreur récupération dossiers :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour lister fichiers dans chaque dossier
router.get('/dossiersFile', async (req, res) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Delimiter: '/',
    });

    const data = await s3Client.send(command);
    const dossiers = data.CommonPrefixes ? data.CommonPrefixes.map(prefix => prefix.Prefix.replace(/\/$/, '')) : [];

    const dossiersAvecFichiers = [];

    for (const dossier of dossiers) {
      const filesCommand = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: `${dossier}/`,
      });

      const filesData = await s3Client.send(filesCommand);

      const fichiers = filesData.Contents ? filesData.Contents.map(file => ({
        fileName: file.Key.split('/').pop(),
        fullPath: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
      })) : [];

      dossiersAvecFichiers.push({
        dossier,
        fichiers,
      });
    }

    res.json(dossiersAvecFichiers);
  } catch (err) {
    console.error('Erreur récupération fichiers :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir une URL signée
router.get('/get-signed-url', async (req, res) => {
  const { fileName } = req.query;

  if (!fileName) {
    return res.status(400).json({ error: 'Le nom complet du fichier est requis (avec dossier)' });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    res.json({ signedUrl });
  } catch (err) {
    console.error('Erreur URL signée :', err);
    res.status(500).json({ error: 'Erreur lors de la génération de l\'URL signée' });
  }
});

// ✅ Route pour renommer un fichier
router.post("/rename", async (req, res) => {
  const { oldKey, newKey } = req.body;

  if (!oldKey || !newKey) {
    return res.status(400).json({ error: "Clés manquantes" });
  }

  try {
    // Vérification si le fichier avec le nouveau nom existe déjà
    const headCommand = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: newKey,
    });

    try {
      await s3Client.send(headCommand);
      return res.status(400).json({ error: "Le fichier avec ce nom existe déjà" });
    } catch (err) {
      // Si le fichier n'existe pas, on continue avec le renommage
      console.log("Fichier n'existe pas, on peut continuer le renommage.");
    }

    // Copie du fichier vers le nouveau nom
    await s3Client.send(new CopyObjectCommand({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${oldKey}`,
      Key: newKey,
    }));

    // Suppression du fichier ancien
    await s3Client.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: oldKey,
    }));

    res.json({ message: "Fichier renommé avec succès" });
  } catch (error) {
    console.error("Erreur renommage:", error);
    res.status(500).json({ error: "Erreur interne" });
  }
});

router.delete("/delete", async (req, res) => {
  const key = req.query.key;

  console.log("🔍 Suppression demandée pour la clé :", key);

  if (!key || typeof key !== "string" || key.trim() === "") {
    return res.status(400).json({ error: "Clé manquante ou invalide" });
  }

  try {
    // Vérifie si le fichier existe
    await s3Client.send(new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }));

    // Supprime le fichier
    await s3Client.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }));

    console.log("✅ Fichier supprimé avec succès :", key);
    return res.status(200).json({ message: "Fichier supprimé avec succès", key });

  } catch (err) {
    console.error("❌ Erreur lors de la suppression :", err);

    // Vérifie si le fichier n'existe pas ou a déjà été supprimé
    if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
      return res.status(404).json({ error: "Le fichier n'existe pas ou a déjà été supprimé" });
    }

    // Problème de permission
    if (err.name === "AccessDenied") {
      return res.status(403).json({ error: "Accès refusé : vous n'avez pas les permissions nécessaires" });
    }

    // Autres erreurs possibles
    return res.status(500).json({
      error: "Erreur interne lors de la suppression du fichier",
      details: err.message,
    });
  }
});

module.exports = router