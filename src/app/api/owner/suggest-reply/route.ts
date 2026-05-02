import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { generateReplySuggestions } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "STORE_OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ratingId } = await req.json();
    
    const rating = await db.rating.findUnique({
      where: { id: ratingId }
    });

    if (!rating) {
      return NextResponse.json({ error: "Rating not found" }, { status: 404 });
    }

    const suggestions = await generateReplySuggestions(rating.comment || "No text provided", rating.value);
    
    return NextResponse.json(suggestions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
