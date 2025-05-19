import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { userSlice } from "../../../entities/user/slice/user-slice";
import { CustomFormInput } from "../../../shared/ui/form-input/custom-form-input";
import { CustomFormArea } from "../../../shared/ui/form-area/custom-form-area";
import { addTodo } from "../../../entities/todos/api/add-todo";
import { useMutation } from "@tanstack/react-query";
import type { ToDoTypeWithId } from "../../../entities/todos/type/todo-type";
import { UiButton } from "../../../shared/ui/button/ui-button";
import { queryClient } from "../../../app/providers/react-query/query-provider";

const todoSchema = z.object({
  title: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  list: z.array(
    z.object({
      id: z.number(),
      text: z.string().min(1, "List item is required"),
      isDone: z.boolean(),
    })
  ),
});

type TodoFormData = z.infer<typeof todoSchema>;

export function TodoAddForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
      list: [{ id: 0, text: "", isDone: false }],
    },
  });
  const userId = useSelector(userSlice.selectors.userId);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: addTodo,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos", userId] });

      const previousTodos = queryClient.getQueryData(["todos", userId]);

      queryClient.setQueryData(["todos", userId], (old: ToDoTypeWithId[]) => [
        ...(old || []),
        { ...newTodo, id: "temp-id" },
      ]);

      return { previousTodos };
    },

    onError: (_err, _newTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos", userId], context.previousTodos);
      }
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "list",
  });

  const onSubmit = async (data: TodoFormData) => {
    try {
      if (userId) {
        const todo: ToDoTypeWithId = await mutateAsync({
          owner: userId,
          title: data.title,
          description: data.description,
          list: data.list.map((item) => ({
            ...item,
            id: crypto.randomUUID(),
          })),
        });
        console.log("Додано новий todo:", todo);
      } else {
        alert("Помилка авторизації! Будь ласка, перезапустіть сайт.");
      }
    } catch (error) {
      console.log("Помилка при додаванні todo:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-amber-50 flex flex-col gap-4 p-4 w-[35%] min-w-[300px] rounded-xl mt-2"
    >
      <CustomFormInput
        label="Title"
        type="text"
        error={errors.title?.message}
        {...register("title")}
      />

      <CustomFormArea
        label="Description"
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="flex flex-col gap-2">
        <label className="font-semibold text-lg">List</label>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-center gap-2 rounded-md border px-3 py-2 shadow-sm bg-white"
          >
            <input
              {...register(`list.${index}.text`)}
              className="flex-1 border-none outline-none bg-transparent text-sm"
              placeholder={`Item ${index + 1}`}
            />

            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 hover:text-red-800 transition"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            append({
              id: Date.now(),
              text: "",
              isDone: false,
            })
          }
          className="self-start text-sm px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          + Add Item
        </button>

        {errors.list && (
          <p className="text-red-500 text-sm mt-1">
            {errors.list.message as string}
          </p>
        )}
      </div>

      <UiButton type="submit" text="Додати" disabled={isPending}></UiButton>
    </form>
  );
}
