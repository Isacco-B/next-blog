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
import { Input } from "../ui/custom-input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { FormError } from "./form-error";
import { loginSchema, loginSchemaType } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/actions/auth/login";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [showPassowrd, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: loginSchemaType) {
    setError("");
    startTransition(() => {
      login(values)
        .then((res) => {
          if (res?.success) {
            toast({
              title: "Success",
              description: res.success || "Login successful",
            });
            form.reset();
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
        });
    });
  }

  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="john.doe@example.com"
                      type="email"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <Button
                    size="sm"
                    variant="link"
                    asChild
                    className="px-0 font-normal"
                  >
                    <Link href="/reset">Forgot password?</Link>
                  </Button>
                </FormItem>
              )}
            />
          </div>

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
              <span>Login</span>
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
