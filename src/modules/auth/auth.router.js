import { Router } from "express";
import * as authController from './auth.controller.js'
// import { asyncHandler } from "../../services/errorHandling.js";

const router=Router();
router.post('/signup',authController.signUp)
router.post('/signin',authController.signIN)
router.get('/confirmEmail',authController.confirmEmail)
router.patch('/sendCode',authController.sendCode)
router.patch('/forgetPassword',authController.forgetPssword)
router.delete('/invalidConfirm', authController.deleteInvalidConfirm);
export default router;
