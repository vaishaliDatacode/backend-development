import express from 'express';

import authMiddleware from '../middlewares/authMiddleware';
import categoryController from '../controllers/categoryController';

const router = express.Router();

router.post('/', authMiddleware(['Admin']), categoryController.createCategory);
router.get('/', authMiddleware(['Admin', 'User']), categoryController.getAllCategories);
router.get('/:id', authMiddleware(['Admin', 'User']), categoryController.getCategoryById);
router.put('/:id', authMiddleware(['Admin']), categoryController.updateCategory);
router.delete('/:id', authMiddleware(['Admin']), categoryController.deleteCategory);


export default router;