import { useState } from "react";
import ReactDOM from "react-dom";
import type { ToDoListType } from "../../../entities/todos/type/todo-type";
import { UiButton } from "../../../shared/ui/button/ui-button";

interface EditTaskModalProps {
  task: ToDoListType;
  onClose: () => void;
  onSave: (updatedTask: ToDoListType) => void;
}

export const EditTaskModal = ({ task, onClose, onSave }: EditTaskModalProps) => {
  const [text, setText] = useState(task.text);
  const [description, setDescription] = useState(task.descriptionTask || "");

  const handleSave = () => {
    onSave({ ...task, text, descriptionTask: description });
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Редагувати таску</h2>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Назва таски"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Опис"
        />
        <div className="flex justify-end gap-3">
          <UiButton text="Скасувати" type="button" onClick={onClose} />
          <UiButton text="Зберегти" type="button" onClick={handleSave} />
        </div>
      </div>
    </div>,
    document.body
  );
};
