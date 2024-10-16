"use client";

import { useCallback, useEffect, useState } from "react";
import { CardWrapper } from "./card-wrapper";
import { useRouter, useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/auth/new-verification";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function NewVerificationForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token");
      return;
    }
    newVerification(token)
      .then((res) => {
        if (res.success) {
          setSuccess(res.success);
          toast({
            title: "Success",
            description: res.success || "Account verified!",
          });
          setTimeout(() => router.push("/login"), 2000);
        }
        setError(res.error);
      })
      .catch(() => {
        setError("Something went wrong, please try again later");
        toast({
          title: "Error",
          description: "Something went wrong, please try again later",
          variant: "destructive",
        });
      });
  }, [token, router]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification email"
      backButtonHref="/login"
      backButtonLabel="Back to login"
    >
      <div className="flex flex-col items-center justify-center w-full space-y-4">
        {!success && !error && <Loader2 className="w-5 h-5 animate-spin" />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
}
