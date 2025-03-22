


const adminMiddleWare =(req,res,next)=>{

    if(req.body.user.role==="Admin"){
        next()
    }
    else{
        res.send("not authorized")
    }
}

module.exports= adminMiddleWare