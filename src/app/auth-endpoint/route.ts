import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "../../../firebase-admin";

export async function POST(req: NextRequest) {
  try {
    auth.protect();

    const { sessionClaims } = await auth();
    const { room } = await req.json();

    if (!sessionClaims?.sub || typeof room !== "string" || !room) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const adminDb = getAdminDb();

    const email = (sessionClaims as any)?.email ?? "";
    const name = (sessionClaims as any)?.fullName ?? (email || "User");
    const avatar = (sessionClaims as any)?.image ?? "";

    const session = liveblocks.prepareSession(sessionClaims.sub, {
      userInfo: { name, email, avatar },
    });

    // Build identifiers to check membership against (email and user id/sub)
    const identifiers = Array.from(
      new Set([email, sessionClaims.sub].filter((v): v is string => !!v))
    );

    if (identifiers.length === 0) {
      return NextResponse.json(
        { message: "No identifiers to authorize" },
        { status: 400 }
      );
    }

    const snapshots = await Promise.all(
      identifiers.map((id) =>
        adminDb.collectionGroup("rooms").where("userId", "==", id).get()
      )
    );

    const docs = snapshots.flatMap((s) => s.docs);
    const userInRoom = docs.find((doc) => doc.id === room);

    if (userInRoom) {
      session.allow(room, session.FULL_ACCESS);
      const { body, status } = await session.authorize();
      return new Response(body, { status });
    }

    return NextResponse.json(
      { message: "You are not in this room" },
      { status: 403 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
