const express=require('express');
const router=express.Router();
const {createUser, loginUser} = require('../controller/userController')
const {createBook,getBooks}            = require('../controller/bookController')
const { userValidations }     = require("../validations/userValidations")
const { booksValidations }    = require("../validations/bookValidations")

router.post('/register',userValidations, createUser)
router.post('/login', loginUser)
router.post('/books',booksValidations, createBook)
router.get("/books",getBooks)

module.exports=router;