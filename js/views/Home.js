import { html, render } from '../../web_modules/lit-html.js';
import '../../web_modules/lit-icon.js';
import todoCard from '../components/todo-card.js';


export default function Home(page, data) {
  const properties = {
    todoTitle: '',
    todoDescription: ''
  };
  const template = ({ data, properties }) => html`
    <section class="h-full">
      <div>
        <form @submit="${handleForm}" id="addTodo" class="w-full h-full flex-col justify-between items-center px-4">
          <label class="flex-1" aria-label="Todo Title">
            <input
              autocomplete="off"
              .value="${properties.todoTitle}"
              @input="${e => properties.todoTitle = e.target.value}"
              class="rounded-sm w-full h-full border-2 px-2 py-3 mt-3"
              type="text"
              placeholder="Todo title.."
              name="todo">
          </label>
          <label class="flex-1" aria-label="Todo Description">
            <input
              autocomplete="off"
              .value="${properties.todoDescription}"
              @input="${e => properties.todoDescription = e.target.value}"
              class="rounded-sm w-full h-full border-2 px-2 py-3 mt-3"
              type="text"
              placeholder="Todo description.."
              name="todo">
          </label>
          <button
            aria-label="Add"
            class="mt-3 rounded-lg bg-blue-500 hover:bg-blue-700 text-center px-3 py-2 text-white font-bold flex justify-center items-center"
            type="submit">
            Add Todo
          </button>
        </form>
      </div>
      <div ?hidden="${!data.length}">
        <main class="todolist px-4 pb-20">
          <ul>
            ${data.map(todo => todoCard(todo))}
          </ul>
        </main>
      </div>
    </section>
    <lit-iconset>
      <svg><defs>
        <g id="delete"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></g>
        <g id="cloud-off"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45C23.16 18.16 24 16.68 24 15c0-2.64-2.05-4.78-4.65-4.96zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2L21 20.73 4.27 4 3 5.27zM7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73z"></path></g>
      </defs></svg>
    </lit-iconset>
  `;

  renderView(data);

  function handleForm(e) {
    e.preventDefault();
    if (properties.todo === '') return console.warn('[todo] Value is required !!!');

    const todo = {
      id: Date.now(),
      title: properties.todoTitle,
      description: properties.todoDescription,
      synced: 'true',
      updated: 'false',
      done: 'false',
      deleted: 'false',
      date: Date.now()
    };

    const event = new CustomEvent('create-todo', { detail: todo });
    document.dispatchEvent(event);

    // Clean input
    properties.todoTitle = null;
    properties.todoDescription = null;
    renderView(data);
  }

  function renderView(data) {
    const view = template({ data, properties });
    render(view, page);
    const input = document.querySelector('[name="todo"]');
    input.value = '';
  }

  document.addEventListener('render-view', ({ detail }) => {
    renderView(detail);
  });
}
