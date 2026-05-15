import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { AddCampaignForm } from "@/src/components/campaign/campaign";

export default async function Page() {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();

  const userId = currentUser?.uid;

  return (
    <>
      <div className="shim"></div>
      <dialog open={true}>
        <AddCampaignForm userId={{user: userId}} />
      </dialog>
    </>
  );
}