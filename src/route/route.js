const express=require('express');
const router=express.Router();
const {createUser, loginUser}                                   = require('../controller/userController')
const {createBook,getBooks,getBooksById,updateBook,deleteBook}  = require('../controller/bookController')
const { userValidations }                                       = require("../validations/userValidations")
const { booksValidations, updateValidations}                    = require("../validations/bookValidations");
const { createReview,putReviewId ,deleteReview}                 = require('../controller/reviewController');
const { authentication, authorization}                          = require("../middleware/auth")
const {createReviewValidations,updateReviewValidations}         = require("../validations/reviewValidations")

router.post('/register',userValidations,createUser)
router.post('/login', loginUser)

router.post('/books',booksValidations,authentication,authorization, createBook)
router.get("/books",authentication,getBooks)
router.get("/books/:bookId",authentication,getBooksById)
router.put("/books/:bookId",updateValidations,authentication,authorization,updateBook)      
router.delete("/books/:bookId",authentication,authorization,deleteBook)


router.post('/books/:bookId/review',createReviewValidations, createReview)
router.put('/books/:bookId/review/:reviewId',updateReviewValidations, putReviewId)
router.delete("/books/:bookId/review/:reviewId",deleteReview)

router.all("/**",function(req,res){
    res.status(400).send({status:false, message:"invalid http request"})
})
module.exports=router;                                                                      