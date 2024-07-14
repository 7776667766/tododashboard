const Todo = require("../models/TodoModel");
const validator = require("validator");

const addTodoApi = async (req, res, next) => {
  try {
  
    const { title, description} = req.body;

    if (!title || !description) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    const newTodo = await Todo.create({
      title,  
      description,
  
    });
    console.log(newTodo);

    res.status(201).json({
      status: "success",
      data: newTodo,
      message: "New Todo Added Successfully",
    });
  } catch (error) {
    console.error("Error in adding todo Details", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getTodoApi = async (req, res, next) => {
  try {
    let myTodo = [];
    const todos = await Todo.find({ deletedAt: { $exists: false } });

    await Promise.all(
      todos.map(async (todo) => {
        const mytodoData = await getTodoData(todo);
        myTodo.push(mytodoData);
      })
    );

    res.status(200).json({
      status: "success",
      data: myTodo,
    });
  } catch (error) {
    console.log("Error in getting todo", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const updateTodoApi = async (req, res, next) => {
  try {
    const { todoId } = req.params;

    if (!todoId) {
      return res.status(400).json({
        status: "error",
        message: "todo ID is required",
      });
    }

    if (!validator.isMongoId(todoId)) {
      return res.status(400).json({
        status: "error",
        message: "todoId is invalid",
      });
    }

    await Todo.findOneAndUpdate(
      { _id: todoId },
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );

    const mytodoData = await Todo.findOne({ _id: todoId});
    const myTodoUpdatedData = await getTodoData(mytodoData);

    res.status(200).json({
      status: "success",
      data: myTodoUpdatedData,
      message: "Todo Updated Successfully",
    });
  } catch (error) {
    console.log("Error in updating todo", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteTodoApi = async (req, res, next) => {
  try {
    const { todoId } = req.params;

    if (!todoId || !validator.isMongoId(todoId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid todo Id",
      });
    }

    // Ensure todoId is a string
    const todoIdString = String(todoId);

    const todo = await Todo.findById(todoIdString);
    if (!todo) {
      return res.status(404).json({
        status: "error",
        message: "Todo not found",
      });
    }

    await Todo.findByIdAndUpdate(todoIdString, { deletedAt: new Date() });

    res.status(200).json({
      status: "success",
      message: "Todo Deleted Successfully",
    });
  } catch (error) {
    console.error("Error in Deleting Todo", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


module.exports = {
  addTodoApi,
  getTodoApi,
  updateTodoApi,
  deleteTodoApi,
};

const getTodoData = async (data) => {
  const myTodoData = {
    id: data._id,
    title: data.title,
    description: data.description,
    completed:data.completed
  };


  return myTodoData;
};
