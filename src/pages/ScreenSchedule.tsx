import { KanbanBoard } from '@/components';
import { useLocation } from 'react-router-dom';

const ScreenSchedule = () => {
  const state = useLocation();

  return (
    <div className='w-full overflow-scroll '>
      <KanbanBoard state={state} />;
    </div>
  );
};

export default ScreenSchedule;
