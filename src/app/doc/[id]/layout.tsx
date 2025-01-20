import React from "react";
import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

const DocLayout: React.FC<Props> = ({ children, params }) => {
  auth.protect();

  // Unwrapping params with React.use()
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  return <RoomProvider roomId={id}>{children}</RoomProvider>;
};

export default DocLayout;
