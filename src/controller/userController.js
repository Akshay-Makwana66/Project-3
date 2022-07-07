const userModel = require("../model/userModel")
const jwt = require("jsonwebtoken");



//=========================================== 1-Create Author Api ====================================================//


const createUser = async function (req, res) {
  try { 
    const data=req.body;
    let savedData = await userModel.create(data)
    res.status(201).send({ status: true, data: savedData })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
  }
}




//============================================ 2-Login and Token Generation Api =====================================//


const loginUser = async function (req, res) {
  try {
   let data = req.body
 // Checks whether body is empty or not
 if (Object.keys(data).length == 0)return res.status(400).send({ status: false, msg: "Body cannot be empty"});

 // Checks whether email is entered or not
 if (!data.email) return res.status(400).send({ status: false, msg: "Please enter E-mail"});
 let userEmail= data.email

  // Checks whether password is entered or not
 if (!data.password) return res.status(400).send({ status: false, msg: "Please enter Password" }); 
 let userPassword= data.password

 //Checks if the email or password is correct
 let checkCred= await userModel.findOne({email: userEmail,password:userPassword})
 if(!checkCred) return res.status(401).send({status:false, msg:"Email or password is incorrect"})

  //Token generation
    let token = jwt.sign({
      userId: checkCred._id.toString(),
      iat: Math.floor(Date.now()/1000),
      exp: Math.floor(Date.now()/1000)+ 3600
    },
      "4A group"
    );
    res.setHeader("x-api-key", token);

    res.status(201).send({ status: true, data: {token} });
  } 
  catch (err) {
    res.status(500).send({ status: false, msg: err.message })
  }
};

module.exports ={createUser, loginUser}