//jshint esversion:6
const express= require("express");
const bodyParser= require("body-parser");
const app = express();
const mongoose =require("mongoose");

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-sara:sara@cluster0.usgix.mongodb.net/todolistDB");
const itemsSchema={
  name:String
};
const Item =mongoose.model("Item",itemsSchema);
const item1 = new Item({

  name:"Welcome to todo list"

});
const item2 = new Item({

  name:"Hit + to add items"

});
const item3 = new Item({

  name:"<-- hit this to delete items"

});
const defaultItems=[item1,item2,item3];
const listSchema={
  name:String,
  items:[itemsSchema]
};
const List =mongoose.model("List",listSchema);

app.get("/", function(req,res){
  Item.find({},function(err,foundItems){
    if(foundItems.length === 0){
      Item.insertMany(defaultItems);


    res.redirect("/");
  }  else{
      res.render("List",{listTitle:"Today", newListItems:foundItems});
    }
  });
});


 app.get("/:customListName",function(req,res){
  const customListName=req.params.customListName;
  List.findOne({name:customListName},function(err,foundList){
    if(!err){
      if(!foundList){
        const list=new List({
          name:customListName,
          items:defaultItems
        });

        list.save();
        // redirect place is important and put here due the new list created by user not after else because else preview already existed list
res.redirect("/" + customListName);

      }
      else{
        res.render("list",{listTitle:foundList.name,newListItems:foundList.items});
}

}
  });
});

app.post("/", function(req, res){

 const nameOfItem = req.body.newItem;
 const listName= req.body.list;
   const item = new Item({
  name:nameOfItem
  });
if(listName==="Today"){
  item.save();
  res.redirect("/");

}else{
List.findOne({name:listName},function(err,foundList){
  foundList.items.push(item);
  foundList.save();
  res.redirect("/"+listName);
});
}





});
app.post("/delete",function(req,res){
  const checkedItem=req.body.checkbox;
const listName=req.body.listName;
if(listName==="Today"){
  Item.findByIdAndRemove(checkedItem,function(err){
    if(!err){
      console.log("successed");
        res.redirect("/");
      }
    });
  }
    else{
      List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItem}}} )
           res.redirect("/"+listName)




    }
  });





  app.listen(3000,function(){
    console.log("Server started working on port 3000")
  });
