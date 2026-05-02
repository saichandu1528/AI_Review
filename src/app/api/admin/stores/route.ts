import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stores = await db.store.findMany({
      orderBy: { createdAt: "desc" },
      include: { owner: true, _count: { select: { ratings: true } } }
    });
    
    // Calculate average rating for each store
    const storesWithRating = await Promise.all(stores.map(async (store) => {
      const avg = await db.rating.aggregate({
        where: { storeId: store.id },
        _avg: { value: true }
      });
      return { ...store, rating: avg._avg.value || 0 };
    }));

    return NextResponse.json(storesWithRating);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, address, ownerId, imageUrl } = await req.json();

    if (!name || !email || !ownerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const store = await db.store.create({
      data: { name, email, address, ownerId, imageUrl }
    });
    return NextResponse.json(store, { status: 201 });
  } catch (error: any) {
    console.error("Store creation error:", error);

    if (error.code === "P2002") {
      return NextResponse.json({ error: "Store email or owner already assigned" }, { status: 400 });
    }

    return NextResponse.json({ error: error.message || "Failed to create store" }, { status: 500 });
  }
}
