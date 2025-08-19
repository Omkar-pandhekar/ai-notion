import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../../firebase-admin";

export async function POST(req: NextRequest) {
  auth.protect();

  const { sessionClaims } = await auth();
  const { room } = await req.json();

  if (!sessionClaims?.sub || typeof room !== "string" || !room) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Pull optional fields from sessionClaims; they may or may not exist depending on your JWT template
  const email = (sessionClaims as any)?.email ?? "";
  const name = (sessionClaims as any)?.fullName ?? (email || "User");
  const avatar = (sessionClaims as any)?.image ?? "";

  // Always a string: Clerk subject (user id)
  const session = liveblocks.prepareSession(sessionClaims.sub, {
    userInfo: { name, email, avatar },
  });

  // Check membership by email (if present) and by sub (user id)
  const identifiers = Array.from(
    new Set([email, sessionClaims.sub].filter(Boolean))
  ) as string[];

  const snapshots = await Promise.all(
    identifiers.map((id) =>
      adminDb.collectionGroup("rooms").where("userId", "==", id).get()
    )
  );

  const docs = snapshots.flatMap((s) => s.docs);
  const usersInRoom = await adminDb
    .collectionGroup("rooms")
    .where("userId", "==", sessionClaims.email)
    .get();

  if (usersInRoom) {
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();
    return new Response(body, { status });
  }

  return NextResponse.json(
    { message: "You are not in this room" },
    { status: 403 }
  );
}
