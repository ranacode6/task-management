import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../store/slices/taskSlice';

export default function TaskFilter() {
  const dispatch = useDispatch();
  const currentFilter = useSelector(state => state.tasks.filter);

  return (
    <div className="flex space-x-4 mb-6">
      <button
        onClick={() => dispatch(setFilter('all'))}
        className={`px-4 py-2 rounded-md ${
          currentFilter === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
      >
        All
      </button>
      <button
        onClick={() => dispatch(setFilter('completed'))}
        className={`px-4 py-2 rounded-md ${
          currentFilter === 'completed'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
      >
        Completed
      </button>
      <button
        onClick={() => dispatch(setFilter('incomplete'))}
        className={`px-4 py-2 rounded-md ${
          currentFilter === 'incomplete'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
      >
        Incomplete
      </button>
    </div>
  );
}