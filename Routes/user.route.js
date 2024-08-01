import { Router } from 'express';
import { body, query } from 'express-validator';
import {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    login,
    updateMyprofile
} from '../Controllers/user.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = Router();

const userValidationRules = [
    body('name').isString().withMessage('Name must be a string'),
    body('age').isInt({ min: 0 }).withMessage('Age must be a positive integer'),
    body('country').isString().withMessage('Country must be a string')
];

const userIdValidationRules = [
    query('id').isUUID().withMessage('Invalid ID format')
];

router.post('/login', login);
router.post('/create', userValidationRules, createUser);
router.get('/list', auth, getUsers);
router.put('/update', userIdValidationRules.concat(userValidationRules), updateUser);
router.put('/profile', auth, updateMyprofile);
router.delete('/delete', userIdValidationRules, deleteUser);

export default router;
