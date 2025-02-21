import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { user , signOut } = useAuthenticator();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({  //The observeQuery() method in useEffect() listens for data changes.
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });   //Your React App uses the Amplify Data Client (client.models.Todo.create()) to store new Todos.
  }
  function deleteTodo(id: string) {
    client.models.Todo.delete({id});
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li
           onClick={() => deleteTodo(todo.id)}
           key={todo.id}>
            {todo.content}
            </li>
        ))}
      </ul>
      <button onClick={signOut}>Sign out</button>
      <div>
        🥳 TIP: click on the task to delete it.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          {/* Review next step of this tutorial. */}
        </a>
      </div>
    </main>
  );
}

export default App;
