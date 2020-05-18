const express = require('express');

 const app = express();

const filename = 'todos.JSON';

const fs = require ('fs').promises; 

const initioltodos = [] ;

const store = {
  async read () {
    try {
      await fs.access (filename);
      this.todos = JSON.parse( ( 
        await fs.readFile(filename) ).toString());
    } catch (e){
      this.todos = initioltodos;
    }  return this.todos;
  },


  async save (){
    await fs.writeFile (filename,JSON.stringify(store.todos));
  },

async getindexbyid (id){
  try {
    const todos = await this.read();
    return todos.findindex(todo => todo.id === +id);
 }  catch (e) {console.log (e);} 
},

async getnexttodoid(){
  let maxid = 1 ;
  const todos = await this.read ();
  todos.fotEach( todo => { if (todo.id > maxid )
  maxid = todo.id; } ) ;
  return maxid + 1;
},
 todos: [{
  id: 1,
  name:'shimon',
  age: 21
},
{
  id: 2,
  name: 'meir',
  age: 20
}  ]
}


app.get ('/todos',(req, res) => {
store.save();
  res.json (store.read());
})

app.get ('/tos',(req, res) => {
  res.send ('full');
})

app.listen (8000, () => {
  console.log('RANING.....');
});
