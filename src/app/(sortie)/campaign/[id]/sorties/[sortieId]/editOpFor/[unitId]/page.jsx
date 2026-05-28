import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { getSortieById } from "@/src/components/sorties/actions";
import { EditOpForForm } from "@/src/components/sorties/sorties";

export default async function Page(props) {
  const params = await props.params;
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  const sortie = await getSortieById(db, params.id, params.sortieId);
  const unit = sortie.opfor?.find((opUnit) => opUnit.id == params.unitId);

  return (
    <main className="home">
      <EditOpForForm campaignId={params.id} sortieId={params.sortieId} unitId={params.unitId} initialUnit={unit} />
    </main>
  );
}