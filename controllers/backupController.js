const { Backup, User } = require('../models');
const fs = require('fs');
const path = require('path');

// Upload de arquivo
const uploadFile = async (req, res) => {
  try {
    const userId = req.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    // Calcula tamanho do arquivo
    const fileSize = file.size;

    // Busca usuário para verificar espaço disponível
    const user = await User.findByPk(userId);
    const storageInfo = user.getStorageInfo();

    // Verifica se tem espaço suficiente
    if (fileSize > storageInfo.free) {
      // Remove o arquivo se não tiver espaço
      fs.unlinkSync(file.path);
      return res.status(400).json({ 
        error: 'Espaço insuficiente',
        available: storageInfo.free,
        required: fileSize
      });
    }

    // Cria registro do backup no banco
    const backup = await Backup.create({
      userId: userId,
      filename: file.originalname,
      storedName: file.filename,
      filePath: file.path,
      fileSize: fileSize,
      mimeType: file.mimetype
    });

    // Atualiza espaço usado pelo usuário
    await user.update({
      storage_used: user.storage_used + fileSize
    });

    res.status(201).json({
      message: 'Arquivo enviado com sucesso!',
      backup: {
        id: backup.id,
        filename: backup.filename,
        fileSize: backup.fileSize,
        uploadedAt: backup.createdAt
      },
      storage: user.getStorageInfo()
    });

  } catch (error) {
    // Remove o arquivo em caso de erro
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Erro ao fazer upload', details: error.message });
  }
};

// Listar arquivos do usuário
const listFiles = async (req, res) => {
  try {
    const userId = req.userId;
    
    const backups = await Backup.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'filename', 'fileSize', 'mimeType', 'createdAt']
    });

    res.json({
      files: backups,
      count: backups.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar arquivos', details: error.message });
  }
};

// Download de arquivo
const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const backup = await Backup.findOne({
      where: { id, userId }
    });

    if (!backup) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    if (!fs.existsSync(backup.filePath)) {
      return res.status(404).json({ error: 'Arquivo não existe no servidor' });
    }

    res.download(backup.filePath, backup.filename);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao baixar arquivo', details: error.message });
  }
};

// Deletar arquivo
const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const backup = await Backup.findOne({
      where: { id, userId }
    });

    if (!backup) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    // Remove arquivo do sistema
    if (fs.existsSync(backup.filePath)) {
      fs.unlinkSync(backup.filePath);
    }

    // Atualiza espaço usado do usuário
    const user = await User.findByPk(userId);
    await user.update({
      storage_used: user.storage_used - backup.fileSize
    });

    // Remove registro do banco
    await backup.destroy();

    res.json({
      message: 'Arquivo deletado com sucesso',
      storage: user.getStorageInfo()
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar arquivo', details: error.message });
  }
};

module.exports = {
  uploadFile,
  listFiles,
  downloadFile,
  deleteFile
};