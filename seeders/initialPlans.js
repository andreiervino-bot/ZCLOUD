const { Plan } = require('../models');

const createInitialPlans = async () => {
  try {
    const existingPlans = await Plan.count();
    if (existingPlans > 0) {
      console.log('✅ Planos já existem, pulando criação...');
      return;
    }

    const plans = await Plan.bulkCreate([
      {
        id: 'free-plan-123',
        name: 'FREE',
        description: 'Plano gratuito - ideal para testes',
        storage_limit: 1073741824, // 1GB
        price: 0.00
      },
      {
        id: 'premium-plan-456',
        name: 'PREMIUM', 
        description: 'Plano premium - para usuários avançados',
        storage_limit: 10737418240, // 10GB
        price: 19.90
      },
     {
  id: 'enterprise-plan-789',
  name: 'ENTERPRISE',
  description: 'PLANO MÁXIMO - 100GB DE ARMAZENAMENTO', // ✅ AGORA VAI!
  storage_limit: 107374182400,
  price: 99.90
}
    ]);
    
    console.log('✅ Planos iniciais criados com sucesso!');
    console.log('📦 FREE: 1GB | PREMIUM: 10GB | ENTERPRISE: 100GB');
  } catch (error) {
    console.error('❌ Erro ao criar planos:', error.message);
  }
};

module.exports = createInitialPlans;