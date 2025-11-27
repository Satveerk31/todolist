const form = document.getElementById('todo-form');
delBtn.className = 'action-btn';
delBtn.textContent = '🗑️';
delBtn.title = 'Delete';
delBtn.addEventListener('click', ()=>{
todos = todos.filter(t=>t.id !== todo.id);
save();
render();
});


actions.appendChild(editBtn);
actions.appendChild(delBtn);


li.appendChild(left);
li.appendChild(actions);
return li;


function addTodo(text){
const todo = { id: Date.now().toString(), text: text.trim(), completed: false };
todos.unshift(todo);
save();
render();
}


form.addEventListener('submit', (e)=>{
e.preventDefault();
const text = input.value;
if(!text.trim()) return;
if(editingId){
const t = todos.find(x=>x.id===editingId);
if(t){ t.text = text.trim(); }
editingId = null;
input.value = '';
save();
render();
return;
}
addTodo(text);
input.value = '';
});


filterEl.addEventListener('change', render);
clearCompletedBtn.addEventListener('click', ()=>{
todos = todos.filter(t=>!t.completed);
save();
render();
});


function render(){
listEl.innerHTML = '';
const filter = filterEl.value;
let filtered = todos;
if(filter === 'active') filtered = todos.filter(t=>!t.completed);
if(filter === 'completed') filtered = todos.filter(t=>t.completed);
if(filtered.length === 0){
const p = document.createElement('p');
p.style.color = '#6b7280';
p.textContent = 'No tasks yet.';
listEl.appendChild(p);
return;
}
filtered.forEach(t=>{
const el = createTodoElement(t);
listEl.appendChild(el);
});
}


// initial render
render();