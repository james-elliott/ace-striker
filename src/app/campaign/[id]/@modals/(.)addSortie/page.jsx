import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { getSorties } from "@/src/components/sorties/actions";
import { AddSortieForm } from "@/src/components/sorties/sorties";

export default async function Page(props) {
  const params = await props.params;
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const sorties = await getSorties(
      getFirestore(firebaseServerApp),
      params.id,
      currentUser?.uid
  );
  
  return (
    <>
      <div className="shim"></div>
      <dialog open={true}>
        <AddSortieForm campaignId={params.id} sorties={sorties} />
      </dialog>
    </>
  );
}