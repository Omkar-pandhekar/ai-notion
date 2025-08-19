import stringToColor from "@/lib/stringToColor";
import { motion } from "framer-motion";

function FollowPointer({
  x,
  y,
  info,
}: {
  x: number;
  y: number;
  info: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const color = stringToColor(info.name || "1");

  return (
    <motion.div
      className="h-6 w-6 rounded-full absolute z-50"
      style={{
        top: y,
        left: x,
        pointerEvents: "none",
      }}
      initial={{
        scale: 1,
        opacity: 1,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 0,
        opacity: 0,
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M3 2l9 9H9.5l2.5 7.5-1.9.7L7.4 12H3z" />
      </svg>
      <motion.div
        style={{
          backgroundColor: color,
        }}
        initial={{
          scale: 0.5,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.5,
          opacity: 0,
        }}
        className="px-2 py-2 bg-neutral-200 text-black font-bold whitespace-nowrap min-w-max text-xs rounded"
      >
        {info?.name || info.email}
      </motion.div>
    </motion.div>
  );
}

export default FollowPointer;
