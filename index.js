const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose")

//models
const TodoTask = require("./models/TodoTask");

const app = express();

// for loading .env file content
dotenv.config();


// masking static files path with /static
app.use("/static", express.static("public"));

// middleware for parsing bodies from URL. 
app.use(express.urlencoded({ extended: true }));


// serve files with ejs templates
// 
app.set("view engine", "ejs");

/**
 * entry point, here we are querying all todo items
 * and rendering it on todo.ejs
 */
app.get('/', (reg, res) => {

    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    })
});


//POST METHOD Concept
/**
 * saves the todo content in TodoTask collection
 */
//Example of the Insert One Concept and also the Asynchronous Programming Concept
//This is an example 
app.post('/', async (req, res) => {
    //create TodoTask object
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        //save the created object
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});


//UPDATE
/** 
 * here we are handling GET and POST request together for the same uri /edit/:id
 * on GET we are retriving all todos and returning edit todo task id, with which we can show confirm and cancel btn in UI
 * on POST we are updating the same to with todo task id
 */

//example of the Get Req
app.route("/edit/:id").get((req, res) => {
    //retrieving all todos
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
    //example of the Post Request Concept
}).post((req, res) => {
    //updating the todo by id
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

//DELETE
/**
 * endpoint to delete the task by id
  DeleteOne Concept (MongoDB) 
  */
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});


//connection to db
//Example of NO SQL Database Concept
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    // start the server on port 8000---Sean Roades helped me figure out the local host
    // The Listen Concept
    app.listen(8000, () => console.log("Server Up and running"));
});