import { Link } from "react-router-dom";
import { LoginForm } from "../../features/forms/login/login-form";
import { RegisterForm } from "../../features/forms/register/register-form";

type AuthPageProps = {
  type: "login" | "register";
};

export function AuthPage({ type }: AuthPageProps) {
  return (
    <main className="flex items-center justify-center w-[100%] min-h-screen">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md w-full max-w-md flex flex-col items-center justify-center gap-2">
        <h2 className="text-2xl font-bold mb-4">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </h2>
        {type === "login" ? <LoginForm /> : <RegisterForm />}
        <div>
          {type === "login" ? (
            <p>
              {`Ще немає акаунта? `}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Створити
              </Link>
            </p>
          ) : (
            <p>
              {`Є акаунт? `}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Увійти
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
