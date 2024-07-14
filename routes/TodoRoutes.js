const router = require("express").Router();

const {
  addTodoApi,
  getTodoApi,
  updateTodoApi,
  deleteTodoApi,
} = require("../controllers/TodosController");

router.post("/todo/add",  addTodoApi);

router.get("/todo/get", getTodoApi)

router.put("/todo/update/:todoId", updateTodoApi)

router.delete('/todo/delete/:todoId', deleteTodoApi);


module.exports = router;