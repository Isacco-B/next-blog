"use server";

import { getPasswordResetByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { newPasswordSchema, newPasswordSchemaType } from "@/schemas/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function newPassword(
  values: newPasswordSchemaType,
  token: string | null
) {
  if (!token) return { error: "Missing token!" };

  const validatedFields = newPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetByToken(token);

  if (!existingToken) return { error: "Invalid token!" };

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    await prisma.passwordResetToken.delete({ where: { id: existingToken.id } });
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) return { error: "Email does not exist!" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({ where: { id: existingToken.id } });

  return { success: "Password reset successfully! Please login again." };
}
