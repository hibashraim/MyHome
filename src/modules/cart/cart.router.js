import { Router } from "express";
import * as cartController from './cart.controller.js'
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./cart.endpoint.js";
const router=Router();


router.post('/',auth(endPoint.create),cartController.createCart)
router.patch('/removeItem',auth(endPoint.delete),cartController.removeItem)
router.patch('/clear',auth(endPoint.clear),cartController.clearcart)
router.get('/',auth(endPoint.get),cartController.getCart)

export default router;