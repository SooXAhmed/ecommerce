const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");
const orders = require("../models/order");
const User = require("../models/user");
const {verifyToken, verifyAdminToken} = require("../middleware/authMiddleware");


//get the admin page
router.get("/",verifyAdminToken ,async (req, res) => {
    res.render("admin/adminhome");
    console.log("page rendered safely");
});
//get the cats for the admin
router.get('/admincategory',verifyAdminToken,async (req,res)=>{
  const CategoryList =await Category.find();
  if(!CategoryList){
      res.status(500).json({success:false})
  }
  res.render("admin/admincategory",{cats:CategoryList})
})
// get the orders for the admin
router.get('/adminorders',verifyAdminToken,async (req,res)=>{
  const orderslist =await orders.find();
  console.log(orderslist)
  if(!orderslist){
      res.status(500).json({success:false})
  }
  res.render("admin/adminorders",{orders:orderslist})
})
// get the page to add a new cat 
router.get("/addcat",verifyAdminToken,async(req,res)=>{
  res.render("admin/addcategory")
})
//add a new category by the admin
router.post('/addcat',verifyAdminToken,async(req,res)=>{
  let category = new Category({
      name:req.body.name,
      icon:req.body.icon,
      color:req.body.color,
  })
  category = await category.save();
  if(!category){
      return res.status(404).send('the category cant be created')
  }
  res.redirect('/api/v1/admin/addcat/')
})
//get method for the update category
router.get("/editcat/:id",verifyAdminToken,async(req,res)=>{
  const cats=await Category.findById(req.params.id);
  res.render("admin/editcategory",{data:cats})
})
//post method for the update category
router.put('/editcat/:id',verifyAdminToken,async (req,res)=>{
  const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
          name:req.body.name,
          color:req.body.color,
      },
      {new:true},
  )
  if(category){
      res.redirect('/api/v1/admin/admincategory')
  }
  else{
      return res.status(404).json({success:false,message:"category"})
  }

})
//delete category
router.post('/deletecat/:id',verifyAdminToken,(req,res)=>{
  Category.findByIdAndDelete(req.params.id).then(category => {
      if(category){
          return res.status(200).json({success:true,message:'the category has been deleted'})
      }
      else{
          return res.status(404).json({success:false,message:"category"})
      }
  }).catch(err=>{
      return res.status(400).json({success:false,error:err})
  })
})
//del
router.post("/deleteuser/:id",verifyAdminToken ,(req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (user) {
        res.redirect("/api/v1/admin/adminuser")
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product is invalid" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
})
// get the products for the admin
router.get("/adminproduct",verifyAdminToken ,async (req, res) => {
  const results=[];
  const products = await Product.find();
  let x=0;
  for (const docB of products) {
      // Step 4: Extract the referenceId from the document
      const referenceId = docB.category;
      console.log(referenceId)
      // Step 5: Use the referenceId to find the corresponding document in CollectionC
      const documentC = await Category.findById(referenceId);
      results[x]=documentC.name;
      x++;
    }
    //console.log(results[0])
    const count = 1;
    if (!products) {
        res.status(500).json({ success: false });
    }
    res.render("admin/adminproducts", { products: products, count: count,cats:results });
});
// geting the page for posting the product
router.get("/addproduct", (req, res) => {
    res.render("admin/addproduct");
});
// posting a new product
router.post("/addproduct", async (req, res) => {
  console.log("we are posting ")
    const category = await Category.findOne({name:req.body.category});
    console.log(category.id);
    if(!category) {
        return res.status(400).send("Invalid category");
    }
    const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        price: req.body.price,
        category: category.id,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        dateCreated: req.body.dateCreated,
    });
    checkProduct = await newProduct.save();
    if (!checkProduct) {
        return res.status(500).send("the product cant be created");
    }
    res.redirect('/api/v1/admin/addproduct')
});
// get the page for updating the product
router.get('/editproduct/:id',async(req,res)=>{
    const pro=await Product.findById(req.params.id);
    // Step 4: Extract the referenceId from the document
    const referenceId = pro.category;
    console.log(referenceId)
    // Step 5: Use the referenceId to find the corresponding document in CollectionC
      const documentC = await Category.findById(referenceId);
      const cate=documentC.name;
    res.render("admin/editproduct",{data:pro,cate:cate});
})
// updating a product
router.put("/editproduct/:id", async (req, res) => {
    const category = await Category.findOne({name:req.body.category});
    if (!category) {
        return res.status(400).send("Invalid category");
    }
    const product = await Product.findByIdAndUpdate(
        req.params.id,{
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: category.id,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
        dateCreated: req.body.dateCreated,
      },
      { new: true }
    );
    if (!product) {
      return res.status(500).send("the product cant be updated");
    }
    res.redirect('/api/v1/admin/adminproduct')
  });
router.post("/deleteproduct/:id", (req, res) => {
    Product.findByIdAndDelete(req.params.id)
      .then((product) => {
        if (product) {
          res.redirect("/api/v1/admin/adminproduct")
        } else {
          return res
            .status(404)
            .json({ success: false, message: "product is invalid" });
        }
      })
      .catch((err) => {
        return res.status(400).json({ success: false, error: err });
      });
  })
router.get("/adminuser",async(req,res)=>{
    const users = await User.find();
    res.render("admin/admincustomers",{users:users})
})
module.exports = router;