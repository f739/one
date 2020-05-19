const fs = require ('fs').promises; 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');


const app = express();
app.use(bodyParser.json());
app.use(cors());

const filename = 'todos.json';


const initioltodos = ['not'] ;

const store = {
  async read(){
    try {
      await fs.access (filename);
     this.todos = JSON.parse(( await fs.readFile (filename)).toString() );
    } catch (e){ 
    this.todos = initioltodos;
    }
    return this.todos;
  },

  async save (){
    await fs.writeFile (filename,JSON.stringify(store.todos));
  },

async getindexbyid (id){
  try {
    const todos = await this.read();
    return todos.findIndex(todo => todo.id === + id);
 }  catch (e) {console.log (e);} 
},

async getnexttodoid() {
  let maxid = 1 ;
  const todos = await this.read ();
  todos.forEach( todo => { if (todo.id > maxid )
  maxid = todo.id; } ) ;
  return maxid + 1;
},
 todos: []
};





app.get ('/todos',async (req, res) => {

  res.json (await store.read());
})

app.get ('/todos/:id',async (req, res) => {
const todos = await store.read();
const todo  = todos.find (todo => todo.id === +req.params.id );
  res.json (todo);
});


app.post ('/todos', async (req, res) => {
 const todo = req.body;
 todo.id = await store.getnexttodoid();
 store.todos.push (todo);
 await store.save();
  res.json ('OK');
});


app.put ('/todos/:id', async (req, res) => {
  const index = await store.getindexbyid(req.params.id);
  const {title, complated} = req.body;
  const todo = store.todos [index];
  todo.title = title;
  todo.complated = complated;
  await store.save ();
  res.json ('OK');
});

app.delete ('/todos/:id', async (req, res) => {
const index = await store.getindexbyid(req.params.id);
store.todos.splice(index,1);
await store.save ();
  res.json ('OK');
});

app.get('/testget',async (req,res) => {
const featchresp = await fetch ('http://localhost:8000/todos');
const json = await featchresp.json();
res.send(json);
});

app.get('/testpost' ,async (req, res) => {
  try { 
    const fitchresp = await fetch ('http://localhost:8000/todos' , {
      method : 'POST',
      headers: {
        Accept: 'application/json',
        'content-Type': 'application/json'
      },
   body: JSON.stringify({
     title: 'check',
     complated: false
   })
    });
    const json = await fitchresp.json();
    res.send(json);
  } catch (e){
    res.send(e);
  }
});


app.listen (8000, () => {
  console.log('RANING.....');
});
