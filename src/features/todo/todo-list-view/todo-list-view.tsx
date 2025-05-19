import { useQuery } from "@tanstack/react-query";
import { findToDoByUser } from "../../../entities/todos/api/find-todo-by-user";
import type { ToDoTypeWithId } from "../../../entities/todos/type/todo-type";
import { userSlice } from "../../../entities/user/slice/user-slice";
import { useAppSelector } from "../../../app/providers/redux-store/redux";
import { FaTrash, FaEdit, FaShare, FaSave, FaTimes } from "react-icons/fa";
import { ModalShare } from "../todo-modal/todo-modal";
import { useListView } from "./hooks/use-list-view";
import { UiButton } from "../../../shared/ui/button/ui-button";
import AddTaskModal from "../todo-modal/todo-tast-modal";
import { EditTaskModal } from "../todo-modal/edit-tast-modal";

export function TodoListView() {
  const userId = useAppSelector(userSlice.selectors.userId);
  const {
    data: todos,
    isLoading,
    error,
  } = useQuery<ToDoTypeWithId[]>({
    queryKey: ["todos", userId],
    queryFn: () => findToDoByUser(userId!),
    enabled: !!userId,
  });

  const {
    shareTodo,
    handleEditClick,
    handleCancelEdit,
    handleTitleChange,
    handleSaveTitle,
    handleDelete,
    addUserToTodoModal,
    handleShare,
    handleToggleTaskDone,
    editingTodo,
    setShareTodo,
    handleDeleteTask,
    isTaskModalOpen,
    handleOpenNewTaskModal,
    setIsTaskModalOpen,
    handleAddTask,
    handleEditTaskClick,
    handleSaveTask,
    selectedTask,
    setSelectedTask,
  } = useListView({ userId, todos });

  if (isLoading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка при завантаженні</p>;

  return (
    <div className="flex flex-wrap w-[80%] gap-10 space-y-4">
      {todos?.map((todo) => {
        const isOwner = todo.owner === userId;
        const isAdmin = todo.participants?.some(
          (p) => p.id === userId && p.role === "admin"
        );

        const canEdit = isOwner || isAdmin;

        return (
          <div
            key={todo.id}
            className="p-4 bg-white rounded shadow border border-slate-200 min-w-[330px]"
          >
            {editingTodo?.id === todo.id && canEdit ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editingTodo.title}
                  onChange={handleTitleChange}
                  className="text-lg font-bold border-b border-gray-400 flex-grow"
                />
                <FaSave
                  onClick={() => handleSaveTitle(todo.id)}
                  className="text-green-600 cursor-pointer hover:text-green-800"
                  title="Зберегти"
                />
                <FaTimes
                  onClick={handleCancelEdit}
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                  title="Відмінити"
                />
              </div>
            ) : (
              <h2 className="text-lg font-bold flex justify-between items-center gap-5">
                {todo.title}
                {canEdit && (
                  <div className="space-x-4 flex items-center">
                    <FaEdit
                      onClick={() => handleEditClick(todo)}
                      className="text-blue-600 cursor-pointer hover:text-blue-800"
                      title="Редагувати"
                    />
                    <FaTrash
                      onClick={() => handleDelete(todo.id)}
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      title="Видалити"
                    />
                    <FaShare
                      onClick={() => handleShare(todo)}
                      className="text-purple-600 cursor-pointer hover:text-purple-800"
                      title="Поділитись"
                    />
                  </div>
                )}
              </h2>
            )}

            <p className="text-sm text-gray-600">{todo.description}</p>

            <ul className="list-disc list-inside mt-2">
              {todo.list.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col space-y-1 border-b border-gray-100 py-2 group hover:bg-slate-200 rounded-[6px] px-1 cursor-pointer"
                  onClick={() => handleEditTaskClick(todo.id, item)}
                >
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={item.isDone}
                        disabled={!canEdit}
                        onChange={() =>
                          canEdit && handleToggleTaskDone(todo.id, item.id)
                        }
                      />
                      <span className={item.isDone ? "line-through" : ""}>
                        {item.text}
                      </span>
                    </div>
                    {canEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(
                            todo.id,
                            todo.list.filter((value) => value.id !== item.id)
                          );
                        }}
                        className="text-red-500 hover:text-red-700 hover:scale-110"
                        title="Видалити підзавдання"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {item.descriptionTask && (
                    <div className="ml-6 text-sm text-gray-500 italic">
                      {item.descriptionTask}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {canEdit && (
              <div className="w-[100%] flex justify-center mt-3">
                <UiButton
                  text="Нова таска"
                  type="button"
                  onClick={() => handleOpenNewTaskModal(todo.id)}
                ></UiButton>
              </div>
            )}
          </div>
        );
      })}

      <ModalShare
        isOpen={!!shareTodo}
        todoTitle={shareTodo?.title ?? ""}
        onClose={() => setShareTodo(null)}
        onAddParticipant={(email, role) =>
          shareTodo
            ? addUserToTodoModal(shareTodo.id, email, role)
            : Promise.reject()
        }
      />

      {selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleSaveTask}
        />
      )}

      {isTaskModalOpen && (
        <AddTaskModal
          onClose={() => setIsTaskModalOpen(false)}
          onAdd={handleAddTask}
        />
      )}
    </div>
  );
}
