import express from "express";

const port=process.env.PORT || 3000;
const app=express();

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/",(req,res)=>{
  res.render("index.ejs");
});

app.listen(port,(req,res)=>{
  console.log(`server is running on port no ${port}`);
})
