const jwt = require("jsonwebtoken");
const booksmodel = require("../models/blogsModel");
const mongoose = require("mongoose");

const authentication = async function (req, res, next) {
  try {

    let token = req.headers["x-api-key"];

    if (!token) return res.status(400).send({ status: false, msg: "Enter token in header" });

    jwt.verify(token,"project1-AADI",function(error,decoded){

      if(error)return res.status(401).send({ status: false, msg: "Invalid Token" });

      else 
    //   req.userId = decoded.userId;
      next()
   });   
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const authorization = async function (req, res, next) {
  try {

    let bookId = req.params.bookId;
    
    if(bookId){

    if (!mongoose.isValidObjectId(bookId))return res.status(400).send({ status: false, msg: "Please enter bookId as a valid ObjectId"});

      let findBook = await booksmodel.findById(bookId);
      if (findBook) {
        if (req.userId != findBook.bookId)return res.status(403).send({ status: false, msg:"AuthUseror is not authorized to access this data"});
      }
    }
    next();  

  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = { authentication, authorization};