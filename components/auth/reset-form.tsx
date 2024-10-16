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
import { resetSchema, resetSchemaType } from "@/schemas/auth";
import { reset } from "@/actions/auth/reset";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function ResetForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<resetSchemaType>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(value: resetSchemaType) {
    setError("");
    setSuccess("");
    startTransition(() =>
      reset(value)
        .then((res) => {
          if (res?.success) {
            toast({
              title: "Success",
              description: res.success || "Password reset link sent",
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
        })
    );
  }

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          <FormSuccess message={success} />
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
              <span>Send reset link</span>
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
