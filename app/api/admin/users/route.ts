import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    const where: any = {};
    if (role && role !== "ALL") {
      where.role = role;
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        totalSpent: true,
        ordersCount: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ users });
  } catch (err: any) {
    console.error("Admin users GET error:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, role, status } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const updates: any = {};
    if (role) updates.role = role;
    if (status) updates.status = status;

    const user = await prisma.user.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        totalSpent: true,
        ordersCount: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error("Admin user PATCH error:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, role, password } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password || "Admin@2026!", 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        phone: phone || "",
        role: role || "CUSTOMER",
        status: "Active",
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        totalSpent: true,
        ordersCount: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (err: any) {
    console.error("Admin user POST error:", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
