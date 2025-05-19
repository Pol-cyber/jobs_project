import { MainHeader } from "../../widget/header/main-header";
import { TodoList } from "../../widget/todo-list";

export function HomePage() {
  return (
    <div>
      <MainHeader></MainHeader>
      <TodoList></TodoList>
    </div>
  );
}
