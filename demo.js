const express = require("express");

const app = express();
const PORT = 5000;
app.use(express.json());

//middle ware
app.use((req,res,next)=>{
    console.log(req.method);
    console.log(req.url);
    next();
})
console.log("working");

app.get("/", (req, res) => {
    res.send("Hello Rishu jiwjhrpabvn fdresnagv d grwbdr ");
});

app.get("/contact", (req, res) => {
    res.send("contact ");
});

app.get("/about", (req, res) => {
    res.send("about ");
});





app.get("/api/hello",(req,res)=>{
    res.json({
        message:"Hello guys",
        ok:"done"
    });
});

app.get("/api/missing",(req,res)=>{
    res.status(200).json({
        message:"Not found"
    })
});

app.get("/products/:id",(req,res)=>{
    const productId =req.params.id;
    res.status(200).json({
        id:productId
    });
});


app.get("/users/:userid/order/:orderid",(req,res)=>{
    
    const useridf=req.params.userid;
    const orderidge=req.params.orderid;
    res.status(200).json({
        userid:useridf,
        orderid:orderidge
        
    });
});
//query
app.get("/products",(req,res)=>{
    const query =req.query;
    const category=query.category;
    const price= query.price;
    res.json({
        category:category,
        price:price
    });
});


//post
app.post("/api/login",(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    res.status(200).json({
        email:email,
        message:"Login sccesfull"
        
    });
});
app.use((req,res)=>{
    res.send("Page not found 404");
});

app.listen(PORT, () => {
    console.log(`Server started on the port: ${PORT}`);
});