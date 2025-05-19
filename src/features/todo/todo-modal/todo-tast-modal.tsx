import { createPortal } from "react-dom";
import { useState } from "react";

type Props = {
  onClose: () => void;
  onAdd: (task: { id: string; text: string; descriptionTask?: string; isDone: boolean }) => void;
};

export default function AddTaskModal({ onClose, onAdd }: Props) {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      text: text.trim(),
      descriptionTask: description.trim() || undefined,
      isDone: false,
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Нова таска</h2>
        <input
          type="text"
          placeholder="Назва завдання"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          placeholder="Опис (необов'язково)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Скасувати
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Додати
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
