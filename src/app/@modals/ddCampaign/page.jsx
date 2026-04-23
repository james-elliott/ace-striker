import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { AddCampaign } from "@/src/components/Campaign/Campaign";

export default async function Page() {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();

  const userId = currentUser?.uid;

  return (
    <dialog open={true}>
      <AddCampaign userId={userId} />
    </dialog>
  );
}