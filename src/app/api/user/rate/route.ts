import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { generateStoreSummary } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { storeId, value, comment } = await req.json();
    const userId = (session.user as any).id;

    const rating = await db.rating.upsert({
      where: {
        storeId_userId: { storeId, userId }
      },
      update: { value, comment },
      create: { storeId, userId, value, comment }
    });

    // Run AI summarization asynchronously without blocking the response
    (async () => {
      try {
        const ratings = await db.rating.findMany({
          where: { 
            storeId, 
            AND: [
              { comment: { not: null } },
              { comment: { not: "" } }
            ] 
          },
          select: { comment: true }
        });
        
        const reviewTexts = ratings.map(r => r.comment as string);
        const aiSummary = await generateStoreSummary(reviewTexts);
        
        await db.store.update({
          where: { id: storeId },
          data: { aiAnalysis: aiSummary }
        });
      } catch (aiError) {
        console.error("Failed to update AI summary:", aiError);
      }
    })();

    return NextResponse.json(rating);
  } catch (error: any) {
    console.error("Rate API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit rating" }, { status: 500 });
  }
}
