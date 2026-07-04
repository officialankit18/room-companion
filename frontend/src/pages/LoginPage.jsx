import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { Button, Card, Input } from "../components/ui";
import { USER_ROLES } from "../constants/roles";
import { useAuth } from "../hooks/useAuth";
import { loginSchema } from "../schemas/authSchemas";

const dashboardByRole = {
  [USER_ROLES.TENANT]: "/tenant",
  [USER_ROLES.OWNER]: "/owner",
  [USER_ROLES.ADMIN]: "/admin",
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const roleHint = searchParams.get("role");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const user = await login(values);
      const redirectTo = location.state?.from?.pathname || dashboardByRole[user.role] || "/";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="page-container grid min-h-[calc(100vh-65px)] items-center py-10">
      <Card className="mx-auto w-full max-w-md">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">Login</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-body)]">
            {roleHint === USER_ROLES.OWNER
              ? "Access your owner workspace and manage room requests."
              : roleHint === USER_ROLES.TENANT
                ? "Access your tenant workspace and find compatible rooms."
                : "Access your RoomCompanion workspace."}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
          <Input
            label="Password"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />
          <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
            <LogIn size={18} />
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-[var(--color-body)]">
          New here?{" "}
          <Link className="font-semibold text-[var(--color-primary)]" to="/register">
            Create an account
          </Link>
        </p>
      </Card>
    </section>
  );
}
