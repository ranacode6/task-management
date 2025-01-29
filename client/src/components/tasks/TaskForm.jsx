import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { createTask } from '../../services/api';
import { addTask, setError } from '../../store/slices/taskSlice';

export default function TaskForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const response = await createTask(data);
      dispatch(addTask(response.data));
      reset();
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow mb-6">
      <div>
        <label className="form-label">Title</label>
        <input
          type="text"
          {...register('title', { required: 'Title is required' })}
          className="input-field"
        />
        {errors.title && <p className="error-message">{errors.title.message}</p>}
      </div>

      <div>
        <label className="form-label">Description</label>
        <textarea
          {...register('description')}
          className="input-field"
          rows="3"
        />
      </div>

      <div>
        <label className="form-label">Due Date</label>
        <input
          type="date"
          {...register('dueDate', { required: 'Due date is required' })}
          className="input-field"
        />
        {errors.dueDate && <p className="error-message">{errors.dueDate.message}</p>}
      </div>

      <button type="submit" className="btn-primary w-full">
        Add Task
      </button>
    </form>
  );
}