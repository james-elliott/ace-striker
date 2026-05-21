import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { getSortieById } from "@/src/components/sorties/actions";
import Panel from "@/src/components/ui/panel/panel";
import Link from "next/link";

export default async function Page(props) {
  const params = await props.params;
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  const sortie = await getSortieById(db, params.id, params.sortieId);

  return (
    <main>
      <h1>{sortie.name}</h1>
      <div className="row">
        <Panel title="Player Force"
          action={true ? <Link href={`${params.sortieId}/addUnits`}>Add Units</Link> : <button type="button" disabled={true} title="No more PV to spend on units">Add Unit</button>} 
          style={{'--primary-color' : '#636466', flexGrow: 1}}>
            // List out player force units
          </Panel>
        <Panel title="OpFor"
          action={<Link href={`${params.sortieId}/addOpFor`}>Add OpFor</Link>}
          style={{'--primary-color' : '#B82327', flexGrow: 1}}>
            // List out OpFor Units
          </Panel>
      </div>
    </main>
  );
}