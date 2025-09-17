import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    const value = text.trim();
    if (!value) return;
    setItems([{ id: crypto.randomUUID(), text: value, done: false }, ...items]);
    setText("");
  };

  const removeItem = (id) => setItems(items.filter(i => i.id !== id));

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-lg todo-card">
        <h1 className="text-center text-primary mb-6">todo list</h1>
		<p  className="text-center text-dark mb-6">Añade una tarea y presiona Enter</p>

        <input
          className="text-center form-control form-control-lg todo-input mb-3"
          placeholder="Añade una tarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />

        {items.length === 0 ? (
          <p className="text-center text-muted mb-0">No hay tareas, añadir tareas</p>
        ) : (
          <ul className="list-group">
            {items.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center todo-item">
                <span className="todo-text">{item.text}</span>
                <button className="btn btn-outline-danger btn-sm btn-delete" onClick={() => removeItem(item.id)}>×</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
