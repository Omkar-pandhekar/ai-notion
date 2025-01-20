"use client";

import { useMyPresence } from "@liveblocks/react";
import { useOthers } from "@liveblocks/react/suspense";
import FollowPointer from "./FollowPointer";

function LiveCursorProvider({ children }: { children: React.ReactNode }) {
  const [myPresence, updateMyPresenece] = useMyPresence();
  const others = useOthers();

  function handlePointMove(e: PointerEvent<HTMLDivElement>) {
    const cursor = { x: Math.floor(e.pageX), y: Math.floor(e.pageY) };
    updateMyPresenece({ cursor });
  }

  function handlePointLeave() {
    updateMyPresenece({ cursor: null });
  }

  return (
    <div onPointerMove={handlePointMove} onPointerLeave={handlePointLeave}>
      {others
        .filter((other) => other.presence.cursor !== null)
        .map(({ connectionId, presence, info }) => (
          <FollowPointer
            key={connectionId}
            info={info}
            x={presence.cursor!.x}
            y={presence.cursor!.y}
          />
        ))}
      {children}
    </div>
  );
}

export default LiveCursorProvider;
