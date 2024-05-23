import {Router} from 'express'
import * as categoriesController from './categories.controller.js';
import fileUpload, { fileValidation } from '../../services/multer.js';
import subCatergoryRouter from './../subcategory/subcategory.router.js'
import { auth, roles } from "../../middleware/auth.js";
import { endPoint } from './category.endpoint.js';
import { asyncHandler } from "../../services/errorHandling.js";
import * as validators from "./category.validation.js";
import { validation } from "../../middleware/validation.js";

const router=Router() 

router.use('/:id/subcategory',subCatergoryRouter)
router.get('/',auth(endPoint.getAll),asyncHandler(categoriesController.getCategories))
router.get('/active',asyncHandler(categoriesController.getActiveCategory))
router.post("/",auth(endPoint.create),fileUpload(fileValidation.image).single("image"), validation(validators.createCategory),asyncHandler(categoriesController.createCategories))
router.get('/:id',validation(validators.getSpecificCategory),auth(endPoint.specific),asyncHandler(categoriesController.getspecificCategory))
router.put('/:id',auth(endPoint.update),fileUpload(fileValidation.image).single('image'), asyncHandler(categoriesController.updateCategory))
router.delete("/:categoryId", auth(endPoint.delete), asyncHandler(categoriesController.deleteCategory));
export default router;