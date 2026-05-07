import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { getCampaignById } from "@/src/components/Campaign/actions";
import { Campaign } from "@/src/components/Campaign/Campaign";
import { redirect } from "next/navigation";

export default async function Page(props) {
  const params = await props.params;
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();

  const campaign = await getCampaignById(
    getFirestore(firebaseServerApp),
    params.id,
    currentUser?.uid
  );

  if (campaign.status !== 'preparing') {
    return (
      <main>
        <Campaign
          id={params.id}
          initialCampaign={campaign}
          initialUserId={currentUser?.uid || ""}
        >
        </Campaign>
      </main>
    );
  } else {
    redirect('/campaign/'+params.id+'/roster');
  }

  
}