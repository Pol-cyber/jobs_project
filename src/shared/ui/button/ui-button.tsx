export function UiButton({
  onClick,
  text,
  type,
  disabled
}: {
  onClick?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  text: string;
  type: "button" | "submit" | "reset",
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 cursor-pointer"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}