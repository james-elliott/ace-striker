import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { AddCampaignForm } from "@/src/components/Campaign/Campaign";

export default async function Page() {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();

  const userId = currentUser?.uid;

  return (
    <main className="home">
      Full Page
      <AddCampaignForm userId={{user: userId}} />
    </main>
  );
}