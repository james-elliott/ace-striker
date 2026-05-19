import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { AddCampaignForm } from "@/src/components/campaign/campaign";
import Dialog from "@/src/components/ui/dialog/dialog";

export default async function Page() {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();

  const userId = currentUser?.uid;

  return (
    <Dialog>
      <AddCampaignForm userId={{user: userId}} />
    </Dialog>
  );
}