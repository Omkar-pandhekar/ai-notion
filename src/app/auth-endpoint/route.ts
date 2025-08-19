import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "../firebase-admin";

export async function POST(req: NextRequest) {
  auth.protect();

  const { sessionClaims } = await auth();
  const { room } = await req.json();

  if (!sessionClaims?.sub || typeof room !== "string" || !room) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const email = (sessionClaims as any)?.email ?? "";
  const name = (sessionClaims as any)?.fullName ?? (email || "User");
  const avatar = (sessionClaims as any)?.image ?? "";

  const session = liveblocks.prepareSession(sessionClaims.sub, {
    userInfo: { name, email, avatar },
  });

  const adminDb = getAdminDb();

  const usersInRoom = await adminDb
    .collectionGroup("rooms")
    .where("userId", "==", sessionClaims.email)
    .get();
  const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

  if (userInRoom) {
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();
    return new Response(body, { status });
  }

  return NextResponse.json(
    { message: "You are not in this room" },
    { status: 403 }
  );
}
