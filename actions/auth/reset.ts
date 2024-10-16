"use server";

import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { resetSchema, resetSchemaType } from "@/schemas/auth";
import { sendPasswordResetEmail } from "@/utils/emails/passwordReset";

export async function reset(value: resetSchemaType) {
  const validatedFields = resetSchema.safeParse(value);

  if (!validatedFields.success) {
    return { error: "Invalid email" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Couldn't find your account." };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return {
    success:
      "We've sent you an email to reset your password, please check your inbox",
  };
}
