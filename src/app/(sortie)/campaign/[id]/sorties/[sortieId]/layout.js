import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Layout({ children, modals }) {
    const { currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) {
      redirect('/');
    }

  return (
    <>
      { children }
      { modals }
    </>
  );
}
