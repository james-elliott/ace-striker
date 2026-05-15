import Link from "next/link";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { PilotList } from "@/src/components/pilots/pilots";
import { getPilots } from "@/src/components/pilots/actions";
import { getUnits } from "@/src/components/units/actions";
import { ForceList } from "@/src/components/units/units";
import { getCampaignById } from "@/src/components/campaign/actions";
import Panel from "@/src/components/ui/panel/panel";

export default async function Page(props) {
    const params = await props.params;
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
    const db = getFirestore(firebaseServerApp);

    const initialUnits = await getUnits(db, params.id, currentUser?.uid);
    const initialPilots = await getPilots(db, params.id, currentUser?.uid);
    const campaign = await await getCampaignById(db, params.id, currentUser?.uid);

    return (
        <main className="roster">
            {campaign.status === 'preparing' ? <h1>Add units and pilots to start the campaign. 
                <button type="button" disabled={initialPilots.length < 2 || initialUnits.length < 1}>Start Campaign</button>
            </h1> : null }
            <div className="row">
                <Panel title="Units" action={<Link href="roster/addUnit">Add Unit</Link>} style={{'--primary-color' : '#636466', flexGrow: 1}}>
                    <ForceList
                        initialUnits={initialUnits}
                        campaignId={params.id}
                        />
                </Panel>
                <Panel title="Pilots" action={<Link href="roster/addPilot">Add Pilot</Link>} style={{'--primary-color' : '#E0AD2A'}}>
                    <PilotList 
                        initialPilots={initialPilots}
                        campaignId={params.id} 
                    />
                </Panel>
            </div>
        </main>
    );
}