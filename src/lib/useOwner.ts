import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/";
import { collectionGroup, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";

function useOwner() {
  const { user } = useUser();
  const room = useRoom();
  const [isOwner, setIsOwner] = useState(false);

  const currentEmail = user?.emailAddresses?.[0]?.emailAddress;

  const [usersInRoom] = useCollection(
    currentEmail
      ? query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
      : null
  );

  useEffect(() => {
    if (usersInRoom?.docs && usersInRoom.docs.length > 0 && currentEmail) {
      const owners = usersInRoom.docs.filter(
        (doc) => doc.data().role === "owner"
      );
      setIsOwner(owners.some((owner) => owner.data().userId === currentEmail));
      return;
    }
    setIsOwner(false);
  }, [usersInRoom, currentEmail]);

  return isOwner;
}

export default useOwner;
