import { AddUnitForm } from "@/src/components/units/units";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp";
import { getFirestore } from "firebase/firestore";
import { getCampaignById } from "@/src/components/campaign/actions";

export default async function Page(props) {
  const params = await props.params;
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();

  const campaign = await getCampaignById(getFirestore(firebaseServerApp), params.id, currentUser?.uid);

  return (
    <main className="home">
      <AddUnitForm campaignId={params.id} initialCampaign={campaign} />
    </main>
  );
}