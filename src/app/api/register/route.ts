import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { name, email, password, address, role } = await req.json();

    if (!name || !email || !password || !address) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role: role || "NORMAL",
      },
    });



    // Send welcome email asynchronously
    try {
      await sendWelcomeEmail(email, name, password, role || "NORMAL");
    } catch (mailError) {
      console.error("Failed to send welcome email:", mailError);
    }

    return NextResponse.json({ 
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
