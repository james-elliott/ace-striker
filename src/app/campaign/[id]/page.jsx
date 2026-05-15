import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { getCampaignById } from "@/src/components/campaign/actions";
import { Campaign } from "@/src/components/campaign/campaign";
import { redirect } from "next/navigation";
import { getSorties } from "@/src/components/sorties/actions";

export default async function Page(props) {
  const params = await props.params;
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  const campaign = await getCampaignById(
    db,
    params.id,
    currentUser?.uid
  );

  const sorties = await getSorties(
    db,
    params.id,
    currentUser?.uid
  );

  if (campaign && campaign.status && campaign.status !== 'preparing') {
    return (
      <main>
        <Campaign
          campaignId={params.id}
          initialSorties={sorties}
        >
        </Campaign>
      </main>
    );
  } else {
    redirect('/campaign/'+params.id+'/roster');
  }
}