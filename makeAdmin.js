const { sequelize, User } = require('./models');

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco!');
    
    // ALTERA PARA O EMAIL QUE VOCÊ USOU NO REGISTRO!
    const user = await User.findOne({ where: { email: 'andrei@email.com' } });
    
    if (user) {
      await user.update({ is_admin: true });
      console.log('✅ AGORA VOCÊ É ADMIN!');
      console.log('👤 Usuário:', user.name);
      console.log('📧 Email:', user.email);
      console.log('👑 Admin:', user.is_admin);
    } else {
      console.log('❌ Usuário não encontrado');
      // Lista todos os usuários para você ver qual email usar
      const allUsers = await User.findAll();
      console.log('📋 Usuários cadastrados:');
      allUsers.forEach(u => console.log(`- ${u.name} (${u.email})`));
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    process.exit();
  }
};

main();


// PARA RODAR ESSE ARQUIVO: node makeAdmin.js  para criar um admin
// NÃO ESQUEÇA DE ALTERAR O EMAIL PRAQUE VOCÊ USOU NO REGISTRO!