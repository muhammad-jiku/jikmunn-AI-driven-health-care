import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { IconPlus } from '@tabler/icons-react';
import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import ColumnContainer from './ColumnContainer';
import TaskCard from './TaskCard';

// Interfaces for type safety
interface Column {
  id: string;
  title: string;
}

interface Task {
  id: string;
  columnId: string;
  content: string;
}

interface KanbanState {
  state?: {
    columns?: Array<Partial<Column>>;
    tasks?: Array<Partial<Task>>;
  };
}

interface KanbanBoardProps {
  state?: KanbanState;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ state }) => {
  const defaultCols: Column[] =
    state?.state?.columns?.map((col) => ({
      id: col?.id || generateId().toString(),
      title: col?.title || '',
    })) || [];

  const defaultTasks: Task[] =
    state?.state?.tasks?.map((task) => ({
      id: task?.id || generateId().toString(),
      columnId: task?.columnId || '',
      content: task?.content || '',
    })) || [];

  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  function createTask(columnId: string): void {
    const newTask: Task = {
      id: generateId().toString(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: string): void {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: string, content: string): void {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, content } : task
    );
    setTasks(newTasks);
  }

  function createNewColumn(): void {
    const newColumn: Column = {
      id: generateId().toString(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, newColumn]);
  }

  function deleteColumn(id: string): void {
    setColumns(columns.filter((col) => col.id !== id));
    setTasks(tasks.filter((task) => task.columnId !== id));
  }

  function updateColumn(id: string, title: string): void {
    setColumns(columns.map((col) => (col.id === id ? { ...col, title } : col)));
  }

  function onDragStart(event: DragStartEvent): void {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
    } else if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragEnd(event: DragEndEvent): void {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    if (active.id === over.id) return;

    const isActiveAColumn = active.data.current?.type === 'Column';
    if (isActiveAColumn) {
      setColumns((columns) => {
        const activeIndex = columns.findIndex((col) => col.id === active.id);
        const overIndex = columns.findIndex((col) => col.id === over.id);
        return arrayMove(columns, activeIndex, overIndex);
      });
    } else {
      const isActiveATask = active.data.current?.type === 'Task';
      const isOverATask = over.data.current?.type === 'Task';
      if (isActiveATask && isOverATask) {
        setTasks((tasks) => {
          const activeIndex = tasks.findIndex((t) => t.id === active.id);
          const overIndex = tasks.findIndex((t) => t.id === over.id);
          if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
            tasks[activeIndex].columnId = tasks[overIndex].columnId;
            return arrayMove(tasks, activeIndex, overIndex - 1);
          }
          return arrayMove(tasks, activeIndex, overIndex);
        });
      } else if (isActiveATask) {
        setTasks((tasks) => {
          const activeIndex = tasks.findIndex((t) => t.id === active.id);
          tasks[activeIndex].columnId = over.id.toString();
          return arrayMove(tasks, activeIndex, activeIndex);
        });
      }
    }
  }

  function onDragOver(event: DragOverEvent): void {
    const { active, over } = event;
    if (!over) return;

    if (active.id === over.id) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        const overIndex = tasks.findIndex((t) => t.id === over.id);
        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    } else if (isActiveATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        tasks[activeIndex].columnId = over.id.toString();
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  return (
    <div className='mt-5 min-h-screen w-72 text-white'>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className='m-auto flex gap-4'>
          <div className='flex gap-4'>
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => createNewColumn()}
            className='flex h-[60px] w-[350px] min-w-[350px] cursor-pointer gap-2 rounded-lg border-2 border-columnBackgroundColor bg-mainBackgroundColor p-4 ring-green-500 hover:ring-2'
          >
            <IconPlus />
            Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

function generateId(): number {
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
