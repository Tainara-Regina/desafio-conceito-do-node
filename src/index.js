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



function checkIqualsUserAccount (request, response, next ) {
const { username } = request.body;

const user = users.find(( user ) => user.username === username)

if(user){
    return response.status(400).json({error: 'usuario já existe'})
    }else{
      next();
    }
}

app.post('/users',checkIqualsUserAccount, (request, response) => {
  const {name, username } = request.body;
  const id = uuidv4();
 
const user = {
  id,
  name,
  username,
  todos: []
}

  users.push(user);
  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
 const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
 const { user } = request;
 const { title, deadline } = request.body;


  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
 
  user.todos.push(todo);
  return response.status(201).json(todo);
 
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