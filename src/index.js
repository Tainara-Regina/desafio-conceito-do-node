const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const register = users.find((register) =>  register.username === username)
 
  if(!register){
    return response.status(404).json({error : "Usuario não encontrado"})
  }
    request.user = register;
    return next();
}

app.post('/users', (request, response) => {
  const {name, username } = request.body;
  const id = uuidv4();
  users.push({
  id,
  name,
  username,
  todos : [],
  });
  return response.status(201).json({mensage: "user inserido com sucesso", users})
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
 const { todos } = request.user;

  return response.status(200).json({mensage : "tarefas do usuario",todos})
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
 const { title,deadline } = request.body;
 const { user } = request;

  const register = users.find((register) => register.username === user.username)
 
  const addToDo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()

  }
 
  register.todos.push(addToDo);
  return response.status(201).json({mensage: "atividade inserida com sucesso", register})
 
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const{ user } = request;
  const { title,deadline } = request.body;

  const todos = user.todos.find((todos) => todos.id === id );

  todos.title = title;
  todos.deadline = deadline;

  return response.status(200).json({mensage: "atividade atualizada com sucesso",todos});
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todos = user.id.find((todos) => todos.id === id );
  todos.done = true;

  return response.status(200).json({mensage: "atividade marcada como feito"})
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;
  const todos = user.id.find((todos) => todos.id === id);
  todos.splice(todos,1);

  return response.status(200).json({mensage: "tarefa excluida com sucesso", todos});


});

module.exports = app;