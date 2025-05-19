import { TodoAddForm } from "../../features/todo/todo-list-add/todo-list-add";
import { TodoListView } from "../../features/todo/todo-list-view";

export function TodoList(){

    return(
        <main className="flex items-center flex-col gap-2">
            <TodoAddForm></TodoAddForm>
            <TodoListView></TodoListView>
        </main>
    )
}