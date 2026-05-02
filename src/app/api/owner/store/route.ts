import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "STORE_OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const store = await db.store.findUnique({
      where: { ownerId: (session.user as any).id },
      include: { _count: { select: { ratings: true } } }
    });

    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    const avg = await db.rating.aggregate({
      where: { storeId: store.id },
      _avg: { value: true }
    });

    return NextResponse.json({ ...store, rating: avg._avg.value || 0 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "STORE_OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, address, imageUrl } = await req.json();
    
    // Create an update object with only defined fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (address !== undefined) updateData.address = address;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const store = await db.store.update({
      where: { ownerId: (session.user as any).id },
      data: updateData
    });
    return NextResponse.json(store);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update store" }, { status: 500 });
  }
}
