const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Backup = sequelize.define('Backup', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    storedName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileSize: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Backup;
};