import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { CustomFormInput } from "../../../shared/ui/form-input/custom-form-input";
import { UiButton } from "../../../shared/ui/button/ui-button";
import { registerUser } from "../../../entities/user/api/register-user";
import { useMutation } from "@tanstack/react-query";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      alert("Реєстрація пройшла успішно");
      navigate("/login");
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    mutate({
      email: data.email,
      password: data.password,
      username: data.username,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-[100%]"
    >
      <CustomFormInput
        label="Username"
        type="username"
        error={errors.username?.message}
        {...register("username")}
      />

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

      <CustomFormInput
        label="Confirm Password"
        type="password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <div className="flex justify-center">
        <UiButton type="submit" text="Register" disabled={isPending}></UiButton>
      </div>
    </form>
  );
}