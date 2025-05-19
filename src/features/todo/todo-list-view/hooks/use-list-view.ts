import { useMutation } from "@tanstack/react-query";
import { patchTodo } from "../../../../entities/todos/api/patсh-todo";
import type {
  ToDoListType,
  ToDoType,
  ToDoTypeWithId,
} from "../../../../entities/todos/type/todo-type";
import { queryClient } from "../../../../app/providers/react-query/query-provider";
import { addUserToTodo } from "../../../../entities/todos/api/add-user-to-todo";
import { deleteToDo } from "../../../../entities/todos/api/delete-todo";
import { useState } from "react";

export function useListView({
  userId,
  todos,
}: {
  userId: string | undefined;
  todos: ToDoTypeWithId[] | undefined;
}) {
  const [editingTodo, setEditingTodo] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [shareTodo, setShareTodo] = useState<ToDoTypeWithId | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [activeTodoId, setActiveTodoId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<ToDoListType | null>(null);
  const [currentTodoId, setCurrentTodoId] = useState<string | null>(null);

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

  const handleSaveTitle = (id: string) => {
    if (!editingTodo) return;

    todoMutation.mutate({
      id,
      updates: { title: editingTodo.title },
    });

    setEditingTodo(null);
  };

  const handleToggleTaskDone = (todoId: string, taskId: string) => {
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

  const handleDelete = (todoId: string) => {
    deleteTodoMutation.mutate(todoId);
  };

  async function addUserToTodoModal(
    todoId: string,
    email: string,
    role: "admin" | "viewer"
  ) {
    addUserToTodoMutation.mutate({ todoId, email, role });
  }

  const handleEditClick = (todo: ToDoTypeWithId) => {
    setEditingTodo({ id: todo.id, title: todo.title });
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const handleDeleteTask = (todoId: string, tasks: ToDoListType[]) => {
    todoMutation.mutate({
      id: todoId,
      updates: { list: tasks },
    });
  };

  const handleShare = (todo: ToDoTypeWithId) => {
    setShareTodo(todo);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingTodo) {
      setEditingTodo({ ...editingTodo, title: e.target.value });
    }
  };

  const handleOpenNewTaskModal = (todoId: string) => {
    setActiveTodoId(todoId);
    setIsTaskModalOpen(true);
  };

  const handleAddTask = (task: ToDoListType) => {
    const todo = todos?.find((t) => t.id === activeTodoId);
    if (!todo) return;

    const updatedList = [...todo.list, task];
    todoMutation.mutate({ id: todo.id, updates: { list: updatedList } });
  };

  const handleEditTaskClick = (todoId: string, task: ToDoListType) => {
    setSelectedTask(task);
    setCurrentTodoId(todoId);
  };

  const handleSaveTask = (updatedTask: ToDoListType) => {
    if (!currentTodoId) return;
    const todo = todos?.find((t) => t.id === currentTodoId);
    if (!todo) return;

    const updatedList = todo.list.map((item) =>
      item.id === updatedTask.id ? updatedTask : item
    );

    todoMutation.mutate({ id: currentTodoId, updates: { list: updatedList } }); // або через mutate
  };

  return {
    shareTodo,
    handleEditClick,
    handleCancelEdit,
    handleTitleChange,
    handleSaveTitle,
    handleDelete,
    addUserToTodoModal,
    handleShare,
    handleToggleTaskDone,
    setShareTodo,
    editingTodo,
    handleDeleteTask,
    isTaskModalOpen,
    handleOpenNewTaskModal,
    setIsTaskModalOpen,
    handleAddTask,
    handleEditTaskClick,
    handleSaveTask,
    selectedTask,
    setSelectedTask
  };
}
