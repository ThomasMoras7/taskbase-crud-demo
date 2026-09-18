import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  useEffect(() => {
    fetch('/api/task')
      .then(ressource => {
        if (!ressource.ok) throw new Error(`HTTP ${ressource.status}`)
        return ressource.json()
      })
      .then(setTasks)
      .catch(erreur => setError(erreur.message))
  }, [])

  const handleAddTask = async (event) => {
    event.preventDefault()
    if (!title.trim() || isAdding) return
    setIsAdding(true)
    try {
      const ressource = await fetch('/api/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, done: false }),
      })
      if (!ressource.ok) throw new Error(`HTTP ${ressource.status}`)
      const newTask = await ressource.json()
      setTasks([...tasks, newTask])
      setTitle('')
      setError('')
    } catch (error) {
      setError(error.message)
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteTask = async (id) => {
    if (deletingId) return
    setDeletingId(id)
    try {
      await fetch(`/api/task/${id}`, { method: 'DELETE' })
      setTasks(tasks.filter(task => task.id !== id))
      setError('')
    } catch (error) {
      setError(error.message)
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleTask = async (id, currentDone, currentTitle) => {
    if (togglingId) return
    setTogglingId(id)
    try {
      const ressource = await fetch(`/api/task/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: currentTitle, done: !currentDone }),
      })
      if (!ressource.ok) throw new Error(`HTTP ${ressource.status}`)
      const updatedTask = await ressource.json()
      setTasks(tasks.map(task => task.id === id ? updatedTask : task))
      setError('')
    } catch (error) {
      setError(error.message)
    } finally {
      setTogglingId(null)
    }
  }

  const handleEditTask = async (id, currentDone) => {
    if (!editTitle.trim() || updatingId) return
    setUpdatingId(id)
    try {
      const ressource = await fetch(`/api/task/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, done: currentDone }),
      })
      if (!ressource.ok) throw new Error(`HTTP ${ressource.status}`)
      const updatedTask = await ressource.json()
      setTasks(tasks.map(task => task.id === id ? updatedTask : task))
      setEditingId(null)
      setEditTitle('')
      setError('')
    } catch (error) {
      setError(error.message)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Taches</h1>
        <p>Votre liste quotidienne</p>
      </header>

      <form className="task-form" onSubmit={handleAddTask}>
        <input
          className="task-input"
          type="text"
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder="Nouvelle tache..."
          aria-label="Nouvelle tache"
        />
        <button
          className="btn btn-fab"
          type="submit"
          aria-label="Ajouter une tache"
          disabled={isAdding}
        >
          {isAdding
            ? <span className="spinner spinner-fab" aria-hidden="true" />
            : <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          }
        </button>
      </form>

      {error &&
        <p className="error-message" role="alert">{error}</p>
      }

      <ul className="task-list">
        {tasks.map(task => (
          <li className="task-item" key={task.id}>
              <div className="task-check">
                <input
                  className="task-checkbox"
                  type="checkbox"
                  checked={task.done}
                  onChange={() => handleToggleTask(task.id, task.done, task.title)}
                  disabled={togglingId === task.id || editingId === task.id}
                  aria-label={`Marquer ${task.title} comme ${task.done ? 'non' : ''} terminee`}
                />
                {togglingId === task.id &&
                  <span className="spinner spinner-check" aria-hidden="true" />
                }
              </div>

              {editingId === task.id
                ? <div className="task-edit">
                    <input
                      className="task-edit-input"
                      type="text"
                      value={editTitle}
                      onChange={event => setEditTitle(event.target.value)}
                      aria-label={`Modifier ${task.title}`}
                    />
                    <button
                      className="btn btn-icon btn-edit-save"
                      type="button"
                      onClick={() => handleEditTask(task.id, task.done)}
                      disabled={updatingId === task.id}
                      aria-label="Sauvegarder"
                    >
                      {updatingId === task.id
                        ? <span className="spinner spinner-btn" aria-hidden="true" />
                        : <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                          <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      }
                    </button>
                    <button
                      className="btn btn-icon"
                      type="button"
                      onClick={() => { setEditingId(null); setEditTitle('') }}
                      aria-label="Annuler"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                        <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </button>
                  </div>
                : <span className={task.done ? 'task-title task-title-done' : 'task-title'}>{task.title}</span>
              }

              <button
                className="btn btn-icon"
                type="button"
                onClick={() => { setEditingId(task.id); setEditTitle(task.title) }}
                disabled={editingId !== null && editingId !== task.id}
                aria-label={`Modifier ${task.title}`}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </button>

              <button
                className="btn btn-icon"
                type="button"
                onClick={() => handleDeleteTask(task.id)}
                disabled={deletingId === task.id || editingId === task.id}
                aria-label={`Supprimer ${task.title}`}
              >
                {deletingId === task.id
                  ? <span className="spinner spinner-btn" aria-hidden="true" />
                  : <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                }
              </button>
            </li>
        ))}
      </ul>

      {tasks.length === 0 && !error &&
        <p className="empty-state">Aucune tache pour l'instant.</p>
      }
    </div>
  )
}

export default App