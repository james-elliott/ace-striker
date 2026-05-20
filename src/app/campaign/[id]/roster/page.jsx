import Link from "next/link";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { PilotList } from "@/src/components/pilots/pilots";
import { getPilots, removePilot } from "@/src/components/pilots/actions";
import { getUnits, removeUnit } from "@/src/components/units/actions";
import { ForceList } from "@/src/components/units/units";
import { getCampaignById } from "@/src/components/campaign/actions";
import Panel from "@/src/components/ui/panel/panel";

export default async function Page(props) {
    const params = await props.params;
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
    const db = getFirestore(firebaseServerApp);

    const initialUnits = await getUnits(db, params.id, currentUser?.uid);
    let initialPilots = await getPilots(db, params.id, currentUser?.uid);
    const campaign = await getCampaignById(db, params.id, currentUser?.uid);

    const removeUnitFromForce = async(unit) => {
        "use server";
        removeUnit(params.id, unit);
    }
    let unitActions = campaign.status == 'preparing' ? [{name: 'Remove', cb: removeUnitFromForce}] : null;

    const removePilotFromForce = async(pilot) => {
        "use server";
        removePilot(params.id, pilot);
    }
    let pilotActions = campaign.status == 'preparing' ? [{name: 'Remove', cb: removePilotFromForce}] : null;

    return (
        <main className="roster">
            {campaign.status === 'preparing' ? <div className="row">
                <h1>Add units and pilots to start the campaign</h1>
                <button type="button" disabled={initialPilots.length < 2 || initialUnits.length < 1}>Start Campaign</button>
            </div> : null }
            <div className="row">
                <Panel title="Units" 
                    action={<Link href="roster/addUnit">Add Unit</Link>} 
                    style={{'--primary-color' : '#636466', flexGrow: 1}}>
                    <ForceList
                        initialUnits={initialUnits}
                        campaignId={params.id}
                        campaign={campaign}
                        perUnitActions={unitActions}
                        />
                </Panel>
                <Panel title="Pilots" 
                    action={initialPilots.length < 6 ? <Link href="roster/addPilot">Add Pilot</Link> : <button type="button" disabled={true} title="Only 6 named pilots allowed in a campaign">Add Pilot</button>} 
                    style={{'--primary-color' : '#E0AD2A'}}>
                    <PilotList 
                        initialPilots={initialPilots}
                        campaignId={params.id}
                        perPilotActions={pilotActions}
                    />
                </Panel>
            </div>
        </main>
    );
}