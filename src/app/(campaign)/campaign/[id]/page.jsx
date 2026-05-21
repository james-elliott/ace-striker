import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { Campaign } from "@/src/components/campaign/campaign";
import { getSorties } from "@/src/components/sorties/actions";

export default async function Page(props) {
  const params = await props.params;
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  const sorties = await getSorties(db, params.id, currentUser?.uid);

  return (
    <main>
      <Campaign
        campaignId={params.id}
        initialSorties={sorties}
      >
      </Campaign>
    </main>
  );
}