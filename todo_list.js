const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const listEl = document.getElementById('todo-list');
const filterEl = document.getElementById('filter');
const clearCompletedBtn = document.getElementById('clear-completed');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let editingId = null;

function save(){
  localStorage.setItem('todos', JSON.stringify(todos));
}

function createTodoElement(todo){
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.id = todo.id;

  const left = document.createElement('div');
  left.className = 'todo-left';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;

  checkbox.addEventListener('change', ()=>{
    todo.completed = checkbox.checked;
    save();
    render();
  });

  const span = document.createElement('span');
  span.className = 'todo-text' + (todo.completed ? ' completed' : '');
  span.textContent = todo.text;

  span.addEventListener('dblclick', ()=>{
    editingId = todo.id;
    input.value = todo.text;
    input.focus();
  });

  left.appendChild(checkbox);
  left.appendChild(span);

  const actions = document.createElement('div');
  actions.className = 'todo-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'action-btn';
  editBtn.textContent = '✏️';

  editBtn.addEventListener('click', ()=>{
    editingId = todo.id;
    input.value = todo.text;
    input.focus();
  });

  const delBtn = document.createElement('button');
  delBtn.className = 'action-btn';
  delBtn.textContent = '🗑️';

  delBtn.addEventListener('click', ()=>{
    todos = todos.filter(t => t.id !== todo.id);
    save();
    render();
  });

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  li.appendChild(left);
  li.appendChild(actions);

  return li;
}

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
    const t = todos.find(x => x.id === editingId);
    if(t) t.text = text.trim();

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
  todos = todos.filter(t => !t.completed);
  save();
  render();
});

function render(){
  listEl.innerHTML = '';

  const filter = filterEl.value;
  let filtered = todos;

  if(filter === 'active') filtered = todos.filter(t => !t.completed);
  if(filter === 'completed') filtered = todos.filter(t => t.completed);

  if(filtered.length === 0){
    const p = document.createElement('p');
    p.style.color = '#6b7280';
    p.textContent = 'No tasks yet.';
    listEl.appendChild(p);
    return;
  }

  filtered.forEach(t => {
    const el = createTodoElement(t);
    listEl.appendChild(el);
  });
}

render();
