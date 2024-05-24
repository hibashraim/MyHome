// favoriteList.router.js

import express from 'express';
import * as favoriteListController from "./favoriteList.controller.js"
import { auth } from '../../middleware/auth.js';
import { endPoint } from './favoritelist.endpoint.js';
const router = express.Router();

// إضافة منتج لقائمة المفضلة
router.post('/add', auth(endPoint.getActive), favoriteListController.addToFavoriteList);

// حذف منتج من قائمة المفضلة
router.delete('/remove', auth(endPoint.getActive), favoriteListController.removeFromFavoriteList);

export default router;
