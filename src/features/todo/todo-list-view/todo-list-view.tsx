import { useMutation, useQuery } from "@tanstack/react-query";
import { findToDoByUser } from "../../../entities/todos/api/find-todo-by-user";
import type {
  ToDoType,
  ToDoTypeWithId,
} from "../../../entities/todos/type/todo-type";
import { userSlice } from "../../../entities/user/slice/user-slice";
import { useAppSelector } from "../../../app/providers/redux-store/redux";
import { useState } from "react";
import { FaTrash, FaEdit, FaShare, FaSave, FaTimes } from "react-icons/fa";
import { patchTodo } from "../../../entities/todos/api/path-todo";
import { queryClient } from "../../../app/providers/react-query/query-provider";
import { ModalShare } from "../todo-modal/todo-modal";
import { addUserToTodo } from "../../../entities/todos/api/add-user-to-todo";
import { deleteToDo } from "../../../entities/todos/api/delete-todo";

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

  const [shareTodo, setShareTodo] = useState<ToDoTypeWithId | null>(null);

  const [editingTodo, setEditingTodo] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const todoMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ToDoType> }) =>
      patchTodo(id, updates),
    onMutate: async ({ id, updates }) => {
      if (!userId) return;

      await queryClient.cancelQueries({ queryKey: ["todos", userId] });

      const previousTodos = queryClient.getQueryData<ToDoTypeWithId[]>([
        "todos",
        userId,
      ]);

      if (previousTodos) {
        queryClient.setQueryData<ToDoTypeWithId[]>(["todos", userId], (old) =>
          old?.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  ...updates,
                  list: updates.list ?? todo.list,
                }
              : todo
          )
        );
      }

      return { previousTodos };
    },

    onError: (_, __, context) => {
      if (context?.previousTodos && userId) {
        queryClient.setQueryData(["todos", userId], context.previousTodos);
      }
    },

    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["todos", userId] });
      }
    },
  });

  const addUserToTodoMutation = useMutation({ mutationFn: addUserToTodo });
  const deleteTodoMutation = useMutation({
    mutationFn: deleteToDo,
    onMutate: async (todoId: string) => {
      await queryClient.cancelQueries({ queryKey: ["todos", userId] });

      const previousTodos = queryClient.getQueryData<ToDoTypeWithId[]>([
        "todos",
        userId,
      ]);

      queryClient.setQueryData(["todos", userId], (old?: ToDoTypeWithId[]) =>
        old?.filter((todo) => todo.id !== todoId)
      );

      return { previousTodos };
    },

    onError: (_err, _todoId, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos", userId], context.previousTodos);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", userId] });
    },
  });

  const handleEditClick = (todo: ToDoTypeWithId) => {
    setEditingTodo({ id: todo.id, title: todo.title });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingTodo) {
      setEditingTodo({ ...editingTodo, title: e.target.value });
    }
  };

  const handleSaveTitle = (id: string) => {
    if (!editingTodo) return;

    todoMutation.mutate({
      id,
      updates: { title: editingTodo.title },
    });

    setEditingTodo(null);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const handleDelete = (todoId: string) => {
    deleteTodoMutation.mutate(todoId);
  };

  const handleShare = (todo: ToDoTypeWithId) => {
    setShareTodo(todo);
  };

  const handleToggleTaskDone = (todoId: string, taskId: number) => {
    const todo = todos?.find((t) => t.id === todoId);
    if (!todo) return;

    const updatedList = todo.list.map((item) =>
      item.id === taskId ? { ...item, isDone: !item.isDone } : item
    );

    todoMutation.mutate({
      id: todoId,
      updates: { list: updatedList },
    });
  };

  async function addUserToTodoModal(
    todoId: string,
    email: string,
    role: "admin" | "viewer"
  ) {
    addUserToTodoMutation.mutate({ todoId, email, role });
  }

  if (isLoading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка при завантаженні</p>;

  return (
    <div className="space-y-4">
      {todos?.map((todo) => {
        const isOwner = todo.owner === userId;
        const isAdmin = todo.participants?.some(
          (p) => p.id === userId && p.role === "admin"
        );

        const canEdit = isOwner || isAdmin;

        return (
          <div
            key={todo.id}
            className="p-4 bg-white rounded shadow border border-slate-200 min-w-[200px]"
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
                <li key={item.id} className="flex items-center space-x-2">
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
                </li>
              ))}
            </ul>
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
    </div>
  );
}
