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
    const userId = (session.user as any).id;
    const store = await db.store.findUnique({
      where: { ownerId: userId },
      include: {
        ratings: {
          include: { user: true },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!store) {
      return NextResponse.json({ error: "No store assigned" }, { status: 404 });
    }

    const avg = await db.rating.aggregate({
      where: { storeId: store.id },
      _avg: { value: true }
    });

    const response = {
      storeName: store.name,
      storeAddress: store.address,
      storeImageUrl: store.imageUrl,
      aiAnalysis: store.aiAnalysis,
      averageRating: avg._avg.value || 0,
      usersWhoRated: store.ratings.map(r => ({
        id: r.id,
        name: r.user.name,
        email: r.user.email,
        ratingValue: r.value,
        comment: r.comment,
        ownerReply: r.ownerReply,
        createdAt: r.createdAt
      }))
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
