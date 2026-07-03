import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import { authApi } from "../api/authApi";
import { Button, Card, Input, Select } from "../components/ui";
import { registerSchema } from "../schemas/authSchemas";

export function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "TENANT",
    },
  });

  const onSubmit = async (values) => {
    try {
      await authApi.register(values);
      toast.success("Account created. Check your email for OTP.");
      navigate(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="page-container grid min-h-[calc(100vh-65px)] items-center py-10">
      <Card className="mx-auto w-full max-w-lg">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Join RoomCompanion
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">Create account</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-body)]">
            Register as a tenant or owner. Email verification is required before login.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Full name" {...register("name")} error={errors.name?.message} />
          <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
          <Input
            label="Password"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />
          <Select label="Role" {...register("role")} error={errors.role?.message}>
            <option value="TENANT">Tenant</option>
            <option value="OWNER">Owner</option>
          </Select>
          <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
            <UserPlus size={18} />
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-[var(--color-body)]">
          Already registered?{" "}
          <Link className="font-semibold text-[var(--color-primary)]" to="/login">
            Login
          </Link>
        </p>
      </Card>
    </section>
  );
}

