import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ParticipantRole = "admin" | "viewer";

type ModalShareProps = {
  todoTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onAddParticipant: (email: string, role: ParticipantRole) => Promise<void>;
};

export function ModalShare({ todoTitle, isOpen, onClose, onAddParticipant }: ModalShareProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<ParticipantRole>("viewer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setRole("viewer");
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdd = async () => {
    setLoading(true);
    setError(null);
    try {
      await onAddParticipant(email, role);
      onClose();
    } catch {
      setError("Не вдалося додати користувача.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4">Поділитись завданням</h3>
        <p className="mb-4">{todoTitle}</p>

        <label className="block mb-2 font-semibold" htmlFor="email">
          Введіть email користувача:
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@mail.com"
          className="w-full border border-gray-300 rounded p-2 mb-4"
        />

        <label className="block mb-2 font-semibold" htmlFor="role">
          Виберіть роль:
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as ParticipantRole)}
          className="w-full border border-gray-300 rounded p-2 mb-4"
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <button
          disabled={loading || !email}
          onClick={handleAdd}
          className={`w-full py-2 rounded text-white ${
            loading || !email ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Додаємо..." : "Додати користувача"}
        </button>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded border border-gray-400 hover:bg-gray-100"
        >
          Закрити
        </button>
      </div>
    </div>,
    document.body
  );
}
