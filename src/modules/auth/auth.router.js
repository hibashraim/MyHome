import { Router } from "express";
import * as authController from './auth.controller.js'
import fileUpload, { fileValidation } from "../../services/multer.js";

const router=Router();
router.post('/signup',authController.signUp)
router.post('/signin',authController.signIN)
router.get('/confirmEmail/:token',authController.confirmEmail)
router.patch('/sendCode',authController.sendCode)
router.patch('/forgetPassword',authController.forgetPssword)

export default router;
