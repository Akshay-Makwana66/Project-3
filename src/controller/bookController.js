const booksModel = require("../model/booksModel");



//=========================================== 1-Create Book Api ====================================================//


const createBook = async function (req, res) {
  try { 
    const data=req.body;
    const {title,  excerpt, ISBN, category, subcategory, reviews, releasedAt}=data 
    
      let savedData = await booksModel.create(data)
      res.status(201).send({ status: true, data: savedData })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
  }
}    

//=========================================== 2- getBooks Api ====================================================//

const getBooks= async function(req,res){
  let conditions =req.query;
  const {userId,category,subcategory}=conditions;

  let filter ={isDeleted:false}
  
  if(userId){
     filter.userId =conditions.userId}
// Checks whether userId is a valid ObjectId
// if(conditions.userId) {
//   if (!mongoose.isValidObjectId(conditions.userId))return res.status(400).send({ status: false, msg: "Please Enter userId as a valid ObjectId" })}

  if(category){
  filter.category=conditions.category}
 // Checks if category is empty or entered as a string or contains valid Category
//  if (conditions.category) return res.status(400).send({ status: false, msg: "Please Enter Category" });

  if(subcategory){
  filter.subcategory= conditions.subcategory}
   // Checks if subCategory is empty or entered as a string or contains valid subCategory
//  if (!conditions.subCategory) return res.status(400).send({ status: false, msg: "Please Enter subCategory" });
 
  let getData = await booksModel.find(filter).select({userId:1,title:1,excerpt:1,category:1,reviews:1,releasedAt:1}).sort({title:1})
  res.status(200).send({status:true,message: 'Books list',data:getData})

}

module.exports={createBook,getBooks}
