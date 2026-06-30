import { Router } from 'express';
import * as authC from '../controllers/authController.js';
import * as propertyC from '../controllers/propertyController.js';
import * as bookingC from '../controllers/bookingController.js';
import * as recommendationC from '../controllers/recommendationController.js';
import { auth, allow } from '../middleware/auth.js';

export const router = Router();
router.post('/auth/register', authC.register);
router.post('/auth/login', authC.login);
router.get('/properties', propertyC.list);
router.get('/properties/:id', propertyC.one);
router.post('/properties', auth, allow('HOST','ADMIN'), propertyC.create);
router.post('/properties/:id/favorite', auth, recommendationC.favorite);
router.post('/bookings', auth, bookingC.create);
router.get('/bookings/me', auth, bookingC.mine);
router.post('/bookings/:id/pay', auth, bookingC.pay);
router.get('/recommendations', auth, recommendationC.recommend);
