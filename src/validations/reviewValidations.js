const mongoose = require("mongoose");
const booksModel = require("../model/booksModel")
const reviewModel = require("../model/reviewModel")
const createReviewValidations = async function (req, res, next) {
    try {
        let bookId = req.params.bookId;
        if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, msg: "write valid objectId" });
        let checkBookId = await booksModel.findOne({_id: bookId,isDeleted: false})
        if(!checkBookId)  return res.status(400).send({ status: false, msg: "write  bookId that are present or not deleted" });
        let data = req.body;
        if(Object.keys(data).length==0) return res.status(400).send({status: false, msg: "body can not be empty"})
       
         if(data.reviewedBy){
          if (!/^[a-zA-Z]{2,30}$/.test(data.reviewedBy)) return res.status(400).send({ status: false, msh: "Write reviewer's name only using letter's" });
           }                             
        if (!data.rating) return res.status(400).send({ status: false, msh: "Write rating" });
        if (typeof data.rating != "number") return res.status(400).send({ status: false, msh: "Write rating in a number" });
          if ((data.rating<1) || (data.rating>5)) return res.status(400).send({ status: false, msh: "You can give rating more than 0  or less than five in number only" });

          next();         

        } catch (error) {
            res.status(500).send({ status: false, msg: error.message })
        }
    };
        //   check update api validations
        const updateReviewValidations = async function(req,res,next){
            try{            
        let bId = req.params.bookId;
        if (!mongoose.isValidObjectId(bId)) return res.status(400).send({ status: false, msg: "write valid objectId" });
        let checkbId = await booksModel.findOne({_id: bId,isDeleted: false})
        if(!checkbId)  return res.status(400).send({ status: false, msg: "write valid bId that are present or not deleted" });

        let rId = req.params.reviewId;
        if (!mongoose.isValidObjectId(rId)) return res.status(400).send({ status: false, msg: "write valid reviewId" });
        let checkrId = await reviewModel.findOne({_id: rId,isDeleted: false})
        if(!checkrId)  return res.status(400).send({ status: false, msg: "write valid rId that are present or not deleted" });

        let check = req.body;
        if(Object.keys(check).length==0) return res.status(400).send({status: false, msg: "body can not be empty"});

        if(check.reviewedBy){
              if (/^[a-zA-Z]{2,30}$/.test(check.reviewedBy)) return res.status(400).send({ status: false, msg: "Write reviewer's name only using letter's" });
               }  

        if (!check.rating) return res.status(400).send({ status: false, msh: "Write rating" });
        if (typeof check.rating != "number") return res.status(400).send({ status: false, msh: "Write rating in a number" });
          if ((check.rating<1) || (check.rating>5)) return res.status(400).send({ status: false, msh: "You can give rating more than 1  or less than five in number only" });

       
        
        next();        

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
};


module.exports = { createReviewValidations,updateReviewValidations }