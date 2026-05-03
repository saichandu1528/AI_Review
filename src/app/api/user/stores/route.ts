import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  try {
    const stores = await db.store.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } }
        ]
      },
      orderBy: { createdAt: "desc" },
      include: {
        ratings: true
      }
    });

    const currentUserId = (session?.user as any)?.id;

    const storesWithRating = stores.map((store: any) => {
      const total = store.ratings.length;
      const sum = store.ratings.reduce((acc: number, r: any) => acc + r.value, 0);
      const userRatingObj = store.ratings.find((r: any) => r.userId === currentUserId);
      const userRating = userRatingObj?.value || null;
      const userComment = userRatingObj?.comment || "";
      const userOwnerReply = userRatingObj?.ownerReply || "";

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        imageUrl: store.imageUrl,
        aiAnalysis: store.aiAnalysis,
        overallRating: total > 0 ? sum / total : 0,
        userRating,
        userComment,
        userOwnerReply
      };
    });

    return NextResponse.json(storesWithRating);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
