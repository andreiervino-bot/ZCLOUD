const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100]
      }
    },
    storage_used: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    storage_limit: {
      type: DataTypes.BIGINT,
      defaultValue: 1073741824 // 1GB em bytes (Plano FREE)
    },
    // ✅ NOVO CAMPO: ID do plano do usuário
    planId: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null // Inicia sem plano (vamos definir depois)
    },
    // ✅ CAMPO PARA FUTURO: Status do pagamento
    payment_status: {
      type: DataTypes.ENUM('active', 'inactive', 'pending'),
      defaultValue: 'inactive'
    },
    // No modelo User, adiciona:
    is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
    }
  }, {
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 12);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      }
    }
  });

  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  User.prototype.getStorageInfo = function() {
    return {
      used: this.storage_used,
      limit: this.storage_limit,
      free: this.storage_limit - this.storage_used,
      percent: ((this.storage_used / this.storage_limit) * 100).toFixed(2)
    };
  };

  return User;
};