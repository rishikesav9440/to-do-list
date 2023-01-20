const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
let ejs = require('ejs');
const app = express();
const port = process.env.PORT || 3001;
const _ = require("lodash")
const date = require(__dirname + "/public/js/day.js")
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://rishi-admin:9440161382@cluster0.shzxbcq.mongodb.net/todolistDB");

const itemsSchema =new mongoose.Schema({
    name:String
});

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name:"Welcome to To Do List"
})
const item2 = new Item({
    name:"Hit the + button to add new items"
})
const item3 = new Item({
    name:"<-- Hit this to delete items"
})
const defualtItems =[item1,item2,item3]

const listSchema =({
    name:String,
    items:[itemsSchema]
});

const List = mongoose.model("List",listSchema);


const workItems = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.get("/", function (req, res) {
    
    var dateNow = date.getDate();
    Item.find(function(err,items){
        if(items.length === 0){
            Item.insertMany(defualtItems,function(err){
                })
                res.redirect("/")
        }
        
        
        else{
        
                res.render("list", {
                    listTitle: "Today",
                    hereitems: items
                });
        }
    })
    
})

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);
  
    List.findOne({name: customListName}, function(err, foundList){
      if (!err){
        if (!foundList){
          //Create a new list
          const list = new List({
            name: customListName,
            items: defualtItems
          });
          list.save();
          res.redirect("/" + customListName);
        } else {
          //Show an existing list
  
          res.render("list", {listTitle: foundList.name, hereitems: foundList.items});
        }
      }
    });
  
  
  
  });

  app.post("/", function (req, res) {
    var dateNow = date.getDate();
    const itemName = req.body.itemText;
    const listName = req.body.list;
    const item = new Item({
        name : itemName
    })
    if(listName === "Today")
    {   item.save();
        res.redirect("/")

    }
    else{
        List.findOne({name:listName},function(err,foundListMain){
            foundListMain.items.push(item);
            foundListMain.save()
            res.redirect("/"+listName)
        })
       
    }
})
app.post("/delete",function(req,res){
const itemId = req.body.checkbox;
const listName = req.body.listName; 
console.log(listName)
if(listName === "Today"){
    Item.findByIdAndRemove(itemId,function(err){
        if(!err){
            console.log("Successfully deleted");
            res.redirect("/")
        }
    })
}
else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:itemId}}},function(err,foundList){
        if(!err)
        {
            res.redirect("/"+listName)
        }
    })
}

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));