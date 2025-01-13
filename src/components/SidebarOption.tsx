import { doc } from "firebase/firestore";
import Link from "next/link";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { usePathname } from "next/navigation";

const SidebarOption = ({ href, id }: { href: string; id: string }) => {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href);

  if (!data) return null;

  return (
    <Link
      href={href}
      className={`relative border p-2 rounded-sm ${
        isActive ? "bg-gray-300 font-bold border-black" : "border-gray-400"
      }`}
    >
      <p>{data.title}</p>
    </Link>
  );
};

export default SidebarOption;
