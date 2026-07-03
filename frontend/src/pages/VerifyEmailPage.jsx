import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { authApi } from "../api/authApi";
import { Button, Card, Input } from "../components/ui";
import { verifyEmailSchema } from "../schemas/authSchemas";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialEmail = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: initialEmail,
      otp: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await authApi.verifyEmail(values);
      toast.success("Email verified. You can login now.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resendOtp = async () => {
    const email = getValues("email");
    if (!email) {
      toast.error("Enter email first");
      return;
    }

    try {
      await authApi.resendOtp({ email });
      toast.success("OTP sent again");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="page-container grid min-h-[calc(100vh-65px)] items-center py-10">
      <Card className="mx-auto w-full max-w-md">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Email verification
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">Enter OTP</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-body)]">
            Use the 6 digit OTP sent to your email address.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
          <Input label="OTP" inputMode="numeric" {...register("otp")} error={errors.otp?.message} />
          <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
            <MailCheck size={18} />
            {isSubmitting ? "Verifying..." : "Verify email"}
          </Button>
        </form>

        <div className="mt-5 flex items-center justify-between gap-3 text-sm">
          <button className="font-semibold text-[var(--color-primary)]" type="button" onClick={resendOtp}>
            Resend OTP
          </button>
          <Link className="font-semibold text-[var(--color-heading)]" to="/login">
            Back to login
          </Link>
        </div>
      </Card>
    </section>
  );
}

