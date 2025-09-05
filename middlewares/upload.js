const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.userId; // ID do usuário do token
    const userDir = path.join(__dirname, '../uploads', userId);
    
    // Cria diretório do usuário se não existir
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    // Nome do arquivo: timestamp + nome original
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// Filtro de arquivos (opcional)
const fileFilter = (req, file, cb) => {
  // Aceita qualquer tipo de arquivo (ou pode restringir)
  cb(null, true);
};

// Configuração do multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 100, // 100MB limite por arquivo
  },
  fileFilter: fileFilter
});

module.exports = upload;