"use server";

import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { registerSchema, registerSchemaType } from "@/schemas/auth";
import { sendVerificationEmail } from "@/utils/emails/verificationEmail";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function register(value: registerSchemaType) {
  const validatedFields = registerSchema.safeParse(value);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { name, email, password } = validatedFields.data;
  const hashPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  await prisma.user.create({ data: { name, email, password: hashPassword } });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    success:
      "We've sent you an email to verify your account, please check your inbox",
  };
}
