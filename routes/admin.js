const express = require('express');
const { listUsers, getStats, createPlan, banUser, makeAdmin, changeUserPlan } = require('../controllers/adminController');
const { authMiddleware } = require('../utils/token');
const adminAuth = require('../middlewares/adminAuth');

const router = express.Router();

// Todas as rotas precisam de autenticação E ser admin
router.use(authMiddleware);
router.use(adminAuth);

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Painel administrativo
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/users', listUsers);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Estatísticas do sistema
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas
 */
router.get('/stats', getStats);

/**
 * @swagger
 * /api/admin/plans:
 *   post:
 *     summary: Criar novo plano
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               storage_limit:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Plano criado
 */
router.post('/plans', createPlan);

/**
 * @swagger
 * /api/admin/ban/{id}:
 *   post:
 *     summary: Banir usuário
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário banido
 */
router.post('/ban/:id', banUser);

/**
 * @swagger
 * /api/admin/make-admin/{id}:
 *   post:
 *     summary: Tornar usuário admin
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário promovido
 */
router.post('/make-admin/:id', makeAdmin);

/**
 * @swagger
 * /api/admin/change-plan:
 *   post:
 *     summary: Alterar plano de usuário
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               planId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Plano alterado
 */
router.post('/change-plan', changeUserPlan);

module.exports = router;