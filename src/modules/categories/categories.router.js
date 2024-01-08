import {Router} from 'express'
import * as categoriesController from './categories.controller.js';
import fileUpload, { fileValidation } from '../../services/multer.js';
import subCatergoryRouter from './../subcategory/subcategory.router.js'
import { auth } from '../../middleware/auth.js';
import { endPoint } from './category.endpoint.js';
const router=Router() 

router.use('/:id/subcategory',subCatergoryRouter)
router.get('/',auth(endPoint.getAll),categoriesController.getCategories)
router.get('/active',auth(endPoint.getActive),categoriesController.getAciveCategory)
router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).single('image'),categoriesController.createCategories)
router.get('/:id',auth(endPoint.specific),categoriesController.getspecificCategory)
router.put('/:id',auth(endPoint.update),fileUpload(fileValidation.image).single('image'),categoriesController.updateCategory)
 
export default router;