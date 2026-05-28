import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { getSortieById } from "@/src/components/sorties/actions";
import Panel from "@/src/components/ui/panel/panel";
import Link from "next/link";
import { OpForUnitList, SortiePlayerUnitList } from "@/src/components/sorties/sorties";
import { getCampaignById } from "@/src/components/campaign/actions";

export default async function Page(props) {
  const params = await props.params;
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  const campaign = await getCampaignById(db, params.id);
  const sortie = await getSortieById(db, params.id, params.sortieId);

  // If the sortie is started, render the play screen

  // If the sortie isn't started, render force selection
  return (
    <main>
      <div className="title">
        <h1>{sortie.name}</h1>
        <Link href={`/campaign/${params.id}/`}>Back to sortie list</Link>
      </div>
      <div className="row">
        <Panel title="Player Force"
          action={true ? <Link href={`${params.sortieId}/selectUnits`}>Add Units</Link> : <button type="button" disabled={true} title="Player Force is at PV maximum">Select Units</button>} 
          style={{'--primary-color' : '#636466', flexGrow: 1}}>
            <SortiePlayerUnitList forceUnits={campaign.units} sortieId={params.sortieId} />
          </Panel>
        <Panel title="OpFor"
          action={<Link href={`${params.sortieId}/addOpFor`}>Add OpFor</Link>}
          style={{'--primary-color' : '#B82327', flexGrow: 1}}>
            <OpForUnitList initialSortie={sortie} />
          </Panel>
      </div>
    </main>
  );
  // If the sortie is complete, render the summary of results
}