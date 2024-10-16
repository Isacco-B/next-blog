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
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "@/actions/auth/register";
import { useRouter } from "next/navigation";
import { registerSchema, registerSchemaType } from "@/schemas/auth";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { FormError } from "./form-error";
import { toast } from "@/hooks/use-toast";

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [showPassowrd, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>("");

  const router = useRouter();

  const form = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: registerSchemaType) {
    setError("");
    startTransition(() =>
      register(values)
        .then((res) => {
          if (res.success) {
            toast({
              title: "Success",
              description: res.success || "Registration successful",
            });
            form.reset();
            setTimeout(() => router.push("/login"), 1000);
          }
          if (res?.error) {
            setError(res.error);
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
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John Doe"
                      type="text"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
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
              <span>Create an account</span>
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
