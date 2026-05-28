import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { getSortieById } from "@/src/components/sorties/actions";
import { AssignPlayerPilotForm } from "@/src/components/sorties/sorties";
import { getCampaignById } from "@/src/components/campaign/actions";

export default async function Page(props) {
  const params = await props.params;
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  const campaign = await getCampaignById(db, params.id);
  const unit = campaign.units?.find((unit) => unit.id == params.unitId);
  const pilots = campaign.pilots.filter(pilot => pilot.type == unit.type);

  return (
    <main className="home">
      <AssignPlayerPilotForm campaignId={params.id} sortieId={params.sortieId} unit={unit} forcePilots={pilots} />
    </main>
  );
}