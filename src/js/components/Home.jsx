import { useEffect, useState } from "react";
import { ensureUser, listTasks, createTask, deleteTask, clearAllTasks, USERNAME } from "../api.js";

export default function Home() {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // Al montar → asegurar usuario y cargar tareas
  useEffect(() => {
    (async () => {
      try {
        const userMsg = await ensureUser();
        setMsg(userMsg);

        const data = await listTasks();
        setItems(
          data.map((t) => ({
            id: t.id,
            text: t.label,
            done: t.is_done
          }))
        );
      } catch (e) {
        setErr("Error inicializando: " + e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Crear nueva tarea con Enter
  const handleKeyDown = async (e) => {
    if (e.key !== "Enter") return;
    const value = text.trim();
    if (!value) return;

    try {
      const created = await createTask(value);
      const newTask = {
        id: created.id,
        text: created.label,
        done: created.is_done,
      };
      setItems([newTask, ...items]);
      setText("");
    } catch (e) {
      setErr("Error creando tarea: " + e.message);
    }
  };

  // Eliminar tarea individual
  const removeItem = async (id) => {
    try {
      await deleteTask(id);
      setItems(items.filter((i) => i.id !== id));
    } catch (e) {
      setErr("Error borrando tarea: " + e.message);
    }
  };

  // Eliminar todas las tareas
  const handleClearAll = async () => {
    try {
      await clearAllTasks();
      setItems([]);
    } catch (e) {
      setErr("Error limpiando todas las tareas: " + e.message);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-lg todo-card">
        <h1 className="text-center text-primary mb-6">todo list</h1>
        <p className="text-center text-dark mb-6">
          Usuario: <strong>{USERNAME}</strong>
        </p>

        {msg && <p className="text-center text-success">{msg}</p>}
        {err && <p className="text-center text-danger">{err}</p>}

        <input
          className="text-center form-control form-control-lg todo-input mb-3"
          placeholder="Añade una tarea y presiona Enter"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />

        {loading ? (
          <p className="text-center text-muted mb-0">Cargando…</p>
        ) : items.length === 0 ? (
          <p className="text-center text-muted mb-0">
            No hay tareas en la API
          </p>
        ) : (
          <>
            <ul className="list-group">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center todo-item"
                >
                  <span className="todo-text">{item.text}</span>
                  <button
                    className="btn btn-outline-danger btn-sm btn-delete"
                    onClick={() => removeItem(item.id)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>

            <button
              className="btn btn-outline-danger w-100 mt-3"
              onClick={handleClearAll}
            >
              Limpiar todas las tareas
            </button>
          </>
        )}
      </div>
    </div>
  );
}
