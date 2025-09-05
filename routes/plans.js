const express = require('express');
const { Plan } = require('../models');
const { authMiddleware } = require('../utils/token');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Plans
 *   description: Gerenciamento de planos de assinatura
 */

/**
 * @swagger
 * /api/plans:
 *   get:
 *     summary: Lista todos os planos disponíveis
 *     tags: [Plans]
 *     responses:
 *       200:
 *         description: Lista de planos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plans:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       storage_limit:
 *                         type: integer
 *                       price:
 *                         type: number
 *                         format: float
 */
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.findAll({
      where: { is_active: true },
      attributes: ['id', 'name', 'description', 'storage_limit', 'price']
    });
    
    res.json({ plans });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar planos', details: error.message });
  }
});

/**
 * @swagger
 * /api/plans/{id}:
 *   get:
 *     summary: Busca um plano específico
 *     tags: [Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do plano
 *     responses:
 *       200:
 *         description: Dados do plano
 *       404:
 *         description: Plano não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findByPk(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }
    
    res.json({ plan });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar plano', details: error.message });
  }
});

module.exports = router;