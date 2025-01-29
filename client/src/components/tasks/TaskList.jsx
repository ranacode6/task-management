import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTasks,
  deleteTask as deleteTaskApi,
  updateTask as updateTaskApi
} from '../../services/api';
import {
  setTasks,
  deleteTask,
  updateTask,
  setLoading,
  setError
} from '../../store/slices/taskSlice';
import { format } from 'date-fns';

export default function TaskList() {
  const dispatch = useDispatch();
  const { tasks, loading, error, filter } = useSelector((state) => state.tasks);

  // Local state for editing
  const [editingTask, setEditingTask] = useState(null);
  const [taskDetails, setTaskDetails] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        dispatch(setLoading(true));
        const response = await getTasks();
        dispatch(setTasks(response.data));
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchTasks();
  }, [dispatch]);

  const handleEdit = (task) => {
    setEditingTask(task._id);
    setTaskDetails({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedTask = { ...taskDetails, completed: false }; // Adjust as needed
      const response = await updateTaskApi(editingTask, updatedTask);
      dispatch(updateTask(response.data));
      setEditingTask(null); // Reset editing state
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTaskApi(id);
      dispatch(deleteTask(id));
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      const response = await updateTaskApi(task._id, updatedTask);
      dispatch(updateTask(response.data));
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <div
          key={task._id}
          className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(task)}
              className="h-4 w-4 text-blue-600"
            />
            <div>
              <h3
                className={`font-medium ${
                  task.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                {task.title}
              </h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              <p className="text-xs text-gray-500">
                Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex gap-5 items-center">
            <button
              onClick={() => handleEdit(task)}
              className="text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Edit Form */}
      {editingTask && (
        <div className="bg-gray-100 p-4 rounded-lg shadow mt-4">
          <h2 className="font-semibold text-lg">Edit Task</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={taskDetails.title}
                onChange={(e) =>
                  setTaskDetails({ ...taskDetails, title: e.target.value })
                }
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={taskDetails.description}
                onChange={(e) =>
                  setTaskDetails({
                    ...taskDetails,
                    description: e.target.value
                  })
                }
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                value={taskDetails.dueDate.split('T')[0]} // Format date for input
                onChange={(e) =>
                  setTaskDetails({ ...taskDetails, dueDate: e.target.value })
                }
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Update Task
              </button>
              <button
                type="button"
                onClick={() => setEditingTask(null)} // Cancel editing
                className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
