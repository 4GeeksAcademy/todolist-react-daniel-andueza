const BASE = "https://playground.4geeks.com/todo";
export const USERNAME = "danielandueza";

// Asegura que el usuario exista
export async function ensureUser() {
  const check = await fetch(`${BASE}/users/${USERNAME}`);

  if (check.status === 404) {
    // Usuario no existe → crearlo
    const res = await fetch(`${BASE}/users/${USERNAME}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}"
    });
    if (!res.ok) throw new Error(`Error creando usuario: ${res.status}`);
    return "Usuario creado con éxito";
  }

  if (check.ok) return "Usuario ya existe";

  throw new Error(`Error validando usuario: ${check.status}`);
}

// Obtener lista de tareas del usuario
export async function listTasks() {
  const res = await fetch(`${BASE}/users/${USERNAME}`);
  if (!res.ok) throw new Error(`List error: ${res.status}`);
  const data = await res.json();
  return data.todos; // [{ id, label, is_done }]
}

// Crear tarea
export async function createTask(label) {
  const body = { label, is_done: false };
  const res = await fetch(`${BASE}/todos/${USERNAME}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Error creando tarea: ${res.status}`);
  return res.json(); // { id, label, is_done }
}

// Eliminar tarea individual
export async function deleteTask(id) {
  const res = await fetch(`${BASE}/todos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Error borrando tarea: ${res.status}`);
  return true;
}

// Eliminar TODAS las tareas del usuario
export async function clearAllTasks() {
  const tasks = await listTasks();
  for (const t of tasks) {
    await deleteTask(t.id);
  }
  return true;
}
