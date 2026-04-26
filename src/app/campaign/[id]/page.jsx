import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { getCampaignById } from "@/src/components/Campaign/actions";
import { Campaign } from "@/src/components/Campaign/Campaign";

export default async function Page(props) {
  const params = await props.params;
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();

  const campaign = await getCampaignById(
    getFirestore(firebaseServerApp),
    params.id,
    currentUser?.uid
  );

  return (
    <main>
      {campaign.status == 'preparing' ? 'You need to start the campaign before you can create sorties' : 'This campaign is started'}
      <Campaign
        id={params.id}
        initialCampaign={campaign}
        initialUserId={currentUser?.uid || ""}
      >
      </Campaign>
    </main>
  );
}