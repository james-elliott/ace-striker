
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { getCampaignById } from "@/src/components/campaign/actions";
import { SelectPlayerUnitsForSortieForm } from "@/src/components/sorties/sorties";
import { getSortieById } from "@/src/components/sorties/actions";
import Dialog from "@/src/components/ui/dialog/dialog";

export default async function Page(props) {
  const params = await props.params;
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  const campaign = await getCampaignById(db, params.id, currentUser?.uid);
  const sortie = await getSortieById(db, params.id, params.sortieId);

  return (
    <Dialog>
      <SelectPlayerUnitsForSortieForm forceUnits={campaign.units} sortieUnits={sortie.player} campaignId={params.id} sortieId={params.sortieId} />
    </Dialog>
  );
}