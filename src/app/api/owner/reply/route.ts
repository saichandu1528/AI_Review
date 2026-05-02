import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "STORE_OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ratingId, reply } = await req.json();
    const userId = (session.user as any).id;

    // Verify the store belongs to this owner
    const rating = await db.rating.findUnique({
      where: { id: ratingId },
      include: { store: true }
    });

    if (!rating || rating.store.ownerId !== userId) {
      return NextResponse.json({ error: "Not authorized to reply to this review" }, { status: 403 });
    }

    const updatedRating = await db.rating.update({
      where: { id: ratingId },
      data: { ownerReply: reply }
    });

    return NextResponse.json(updatedRating);
  } catch (error: any) {
    console.error("Owner Reply Error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit reply" }, { status: 500 });
  }
}
