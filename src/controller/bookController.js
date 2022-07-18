const mongoose = require("mongoose");
const booksModel = require("../model/booksModel");
const reviewModel = require("../model/reviewModel")
const aws = require("aws-sdk")

//=========================================== 1-Create Book Api ====================================================//

aws.config.update({
  accessKeyId: "AKIAY3L35MCRVFM24Q7U",
  secretAccessKey: "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",
  region: "ap-south-1"
}) 

let uploadFile = async (file) => {
  return new Promise(function (resolve, reject) {
    // this function will upload file to aws and return the link
    let s3 = new aws.S3({ apiVersion: '2006-03-01' }); // we will be using the s3 service of aws

    var uploadParams = {     
      ACL: "public-read",
      Bucket: "classroom-training-bucket",  //HERE
      Key: "anil/" + file.originalname, //HERE 
      Body: file.buffer
    }


    s3.upload(uploadParams, function (err, data) {
      if (err) {
        return reject({ "error": err })      
      }
      console.log(data)    
      console.log("file uploaded succesfully")
      return resolve(data.Location)
    })

  })
}




const createBook = async function (req, res) {
  try { 
    const data = req.body;
    // console.log(data)
    // console.log(req.files) 
    let files = req.files
    if (files && files.length > 0) {
      //upload to s3 and get the uploaded link
      // res.send the link back to frontend/postman
      let uploadedFileURL = await uploadFile(files[0])
      data.bookCover=uploadedFileURL
      // res.status(201).send({ msg: "file uploaded succesfully", data: uploadedFileURL })
    }
    else {
      res.status(400).send({ msg: "No file found" })
    }
    let savedData = await booksModel.create(data)
      res.status(201).send({ status: true, data: savedData })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: err.message })
  }
}    

//=========================================== 2- getBooks Api ====================================================//

const getBooks= async function(req,res){
  try{
  let conditions =req.query;
  // console.log(conditions)
  if(conditions.userId){
    if (!mongoose.isValidObjectId(conditions.userId)) return res.status(400).send({ status: false, message: " pls entered valid objectId"});
  }
   if(conditions.category){
   let category = await booksModel.findOne({category: conditions.category});

     if(!category) return res.status(400).send({ status: false, message: "write valid category"});
   };

  let getData = await booksModel.find(conditions,{isDeleted: false}).select({ISBN:0,subcategory:0,createdAt:0,updatedAt:0,__v:0}).sort({title:1});
  if (getData.length == 0)return res.status(404).send({ status: false, message: "No books found" });
 res.status(200).send({status:true,message: 'Books list',data:getData});
  }  catch (error) {
  console.log(error);
  res.status(500).send({ status: false, message: error.message });
}
};

//=========================================== 3- getBooksById Api ====================================================//

const getBooksById = async function (req, res) {
  try{

      let id = req.params.bookId
      if (!mongoose.isValidObjectId(id)) return res.status(400).send({ status: false, message: " pls entered valid objectId"});
      let bookDetail = await booksModel.findOne({ _id: id, isDeleted: false })
      if (!bookDetail) {
        return res.status(404).send({ status: false, message: "no books found" })
      }
    
      let object = {
        _id: bookDetail._id,
        title: bookDetail.title,
        excerpt: bookDetail.excerpt,
        userId: bookDetail.userId,
        category: bookDetail.category,
        subcategory: bookDetail.subcategory,
        isDeleted: bookDetail.isDeleted,
        reviews: bookDetail.reviews,
        releasedAt: bookDetail.releasedAt,
        createdAt: bookDetail.createdAt,
        updatedAt: bookDetail.updatedAt
      }
      let review = await reviewModel.find({ bookId: id, isDeleted:false }).select({__v:0,isDeleted:0,updatedAt:0,createdAt:0})  
      if(review){
        object.reviews =review.length;
      }
      object.reviewsData = review
      res.status(200).send({ status: true, message: 'Books list', data: object });
    }catch (error) {
  console.log(error);
  res.status(500).send({ status: false, message: error.message });
}};

//=========================================== 4- updateBook Api ====================================================//

const updateBook = async function(req,res){
  try{
    let bookId = req.params.bookId;
    if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: " pls entered valid objectId"});
    let bookData = req.body;
    let updateBook = await booksModel.findOneAndUpdate({
      _id: bookId, isDeleted: false},
     { title: bookData.title,
      excerpt: bookData.excerpt,
      ISBN: bookData.ISBN,
      releasedAt: bookData.Date
    },{new: true});              
  if(!updateBook) return res.status(404).send({status: false, message: "No books found"})
   res.status(201).send({ status: true, data: updateBook });
} catch (error) {
  console.log(error);
  res.status(500).send({ status: false, message: error.message });
}};

//=========================================== 5- deleteBook Api ====================================================//

const deleteBook = async function( req,res){
  try{
    let bookId = req.params.bookId;
    if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: " pls entered valid objectId"});
    let deleteBookId = await booksModel.findOneAndUpdate( {_id: bookId, isDeleted: false}, {$set:{isDeleted: true, deletedAt: Date.now()}});
    if(!deleteBookId) return  res.status(404).send({ status: false, msg: "no book found"});
    res.status(200).send({ status: true, message: "document is deleted"});
  }catch (error) {
    console.log(error);
    res.status(500).send({ status: false, message: error.message });
  }};
  

module.exports={createBook,getBooks,getBooksById,updateBook,deleteBook}
