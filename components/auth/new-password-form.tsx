"use client";

import { useState, useTransition } from "react";
import { CardWrapper } from "./card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/custom-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newPassword } from "@/actions/auth/new-password";
import { newPasswordSchema, newPasswordSchemaType } from "@/schemas/auth";
import { FormError } from "./form-error";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function NewPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [showPassowrd, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const form = useForm<newPasswordSchemaType>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: newPasswordSchemaType) {
    setError("");
    startTransition(() =>
      newPassword(values, token)
        .then((res) => {
          if (res.success) {
            toast({
              title: "Success",
              description: res.success || "Password changed successfully",
            });
            form.reset();
            setTimeout(() => router.push("/auth/login"), 1000);
          }
          if (res?.error) {
            setError(res?.error);
            form.reset();
          }
        })
        .catch(() => {
          setError("Something went wrong, please try again later");
          toast({
            title: "Error",
            description: "Something went wrong, please try again later",
            variant: "destructive",
          });
        })
    );
  }

  return (
    <CardWrapper
      headerLabel="Enter new password"
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="********"
                      type={showPassowrd ? "text" : "password"}
                      disabled={isPending}
                    />
                    {showPassowrd ? (
                      <EyeOff
                        className="w-5 h-5 absolute z-10 right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowPassword(!showPassowrd)}
                      />
                    ) : (
                      <Eye
                        className="w-5 h-5 absolute z-10 right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowPassword(!showPassowrd)}
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="********"
                    type={showPassowrd ? "text" : "password"}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <span>Change password</span>
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
