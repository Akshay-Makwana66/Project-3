const jwt = require("jsonwebtoken");
const booksmodel = require("../model/booksModel");
const mongoose = require("mongoose");

const authentication = async function (req, res, next) {
  try {

    let token = req.headers["x-api-key"];

    if (!token) return res.status(400).send({ status: false, message: "Enter token in header" });

   jwt.verify(token,"4A group",function(error,decodedToken){

      if(error){
        const message =
        error.message ==="jwt expired"
        ? "Token is expired"
        : "Token is invalid"     

        return res.status(401).send({ status: false, message});
      }
      else 
      req.userId = decodedToken.userId;
      next()
   });   
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const authorization = async function (req, res, next) {
  try {

    let bookId = req.params.bookId;
    
    if(bookId){

    if (!mongoose.isValidObjectId(bookId))return res.status(400).send({ status: false, message: "Please enter bookId as a valid ObjectId"});

      let findBook = await booksmodel.findById(bookId);
     if (!findBook) return res.status(400).send({status: false, message: "no book found"})
     if (req.userId != findBook.userId)return res.status(403).send({ status: false, message:"user is not authorized to access this data"});
      
    }
    next();  

  } catch (error) {
    
    console.log(error);
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { authentication, authorization};