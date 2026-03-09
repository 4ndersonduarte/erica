export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { loginSchema } from "@/lib/validations";
import { signToken } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";

async function findAdminByEmail(email: string) {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase.rpc("get_admin_by_email", {
      admin_email: email,
    });

    if (!error && data && data.length > 0) {
      return data[0];
    }
  }

  try {
    return await prisma.admin.findUnique({
      where: { email },
    });
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        parsed.error.errors[0]?.message ?? "Dados inválidos",
        400
      );
    }

    const { email, password } = parsed.data;

    const admin = await findAdminByEmail(email);
    if (admin) {
      const valid = await bcrypt.compare(password, admin.password);
      if (!valid) return apiError("E-mail ou senha incorretos", 401);
      const token = signToken({ sub: admin.id, email: admin.email, role: "admin" });
      const response = apiSuccess({ token, email: admin.email, role: "admin" });
      response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      return response;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return apiError("E-mail ou senha incorretos", 401);
    }
    const validUser = await bcrypt.compare(password, user.password);
    if (!validUser) {
      return apiError("E-mail ou senha incorretos", 401);
    }

    const token = signToken({ sub: user.id, email: user.email, role: "user" });

    const response = apiSuccess({
      token,
      email: user.email,
      role: "user",
    });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return apiError("Erro ao fazer login", 500);
  }
}