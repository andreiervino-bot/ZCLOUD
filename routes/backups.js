const express = require('express');
const { uploadFile, listFiles, downloadFile, deleteFile } = require('../controllers/backupController');
const { authMiddleware } = require('../utils/token');
const upload = require('../middlewares/upload');

const router = express.Router();

// Todas as rotas precisam de autenticação
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Backups
 *   description: Gerenciamento de arquivos de backup
 */

/**
 * @swagger
 * /api/backups/upload:
 *   post:
 *     summary: Faz upload de um arquivo
 *     tags: [Backups]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo para upload
 *     responses:
 *       201:
 *         description: Arquivo enviado com sucesso
 *       400:
 *         description: Erro no upload (sem arquivo ou espaço insuficiente)
 *       401:
 *         description: Não autorizado
 */
router.post('/upload', upload.single('file'), uploadFile);

/**
 * @swagger
 * /api/backups/files:
 *   get:
 *     summary: Lista todos os arquivos do usuário
 *     tags: [Backups]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de arquivos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       filename:
 *                         type: string
 *                       fileSize:
 *                         type: integer
 *                       mimeType:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Não autorizado
 */
router.get('/files', listFiles);

/**
 * @swagger
 * /api/backups/download/{id}:
 *   get:
 *     summary: Faz download de um arquivo
 *     tags: [Backups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do arquivo
 *     responses:
 *       200:
 *         description: Download do arquivo
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Arquivo não encontrado
 *       401:
 *         description: Não autorizado
 */
router.get('/download/:id', downloadFile);

/**
 * @swagger
 * /api/backups/delete/{id}:
 *   delete:
 *     summary: Deleta um arquivo
 *     tags: [Backups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do arquivo
 *     responses:
 *       200:
 *         description: Arquivo deletado com sucesso
 *       404:
 *         description: Arquivo não encontrado
 *       401:
 *         description: Não autorizado
 */
router.delete('/delete/:id', deleteFile);

module.exports = router;