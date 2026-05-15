import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { AddCampaignForm } from "@/src/components/campaign/campaign";

export default async function Page() {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();

  const userId = currentUser?.uid;

  return (
    <main>
      <AddCampaignForm userId={{user: userId}} />
    </main>
  );
}