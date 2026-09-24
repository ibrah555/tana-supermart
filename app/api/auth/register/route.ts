import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone ? phone.trim() : "",
        passwordHash: hashedPassword,
        role: "CUSTOMER",
        status: "Active",
      },
    });

    const { passwordHash: _, ...safeUser } = newUser;

    return NextResponse.json(
      {
        success: true,
        user: safeUser,
        message: "Account created successfully",
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Auth register error:", err);
    return NextResponse.json({ error: "Failed to register account" }, { status: 500 });
  }
}
