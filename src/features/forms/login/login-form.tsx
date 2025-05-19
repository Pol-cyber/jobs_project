import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { CustomFormInput } from "../../../shared/ui/form-input/custom-form-input";
import { UiButton } from "../../../shared/ui/button/ui-button";
import { loginUser } from "../../../entities/user/api/login-user";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 symbols"),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const userData = await loginUser({email: data.email, password: data.password});
      if (userData) {
        navigate("/");
      } else {
        alert("User not found");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-[100%]"
    >
      <CustomFormInput
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <CustomFormInput
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register("password")}
      />
      <div className="flex justify-center">
        <UiButton type="submit" text="Увійти"></UiButton>
      </div>
    </form>
  );
}