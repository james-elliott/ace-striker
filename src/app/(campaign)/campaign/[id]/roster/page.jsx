import Link from "next/link";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { PilotList } from "@/src/components/pilots/pilots";
import { getPilots, removePilot } from "@/src/components/pilots/actions";
import { getUnits, removeUnit } from "@/src/components/units/actions";
import { ForceList } from "@/src/components/units/units";
import { getCampaignById, startCampaign } from "@/src/components/campaign/actions";
import Panel from "@/src/components/ui/panel/panel";
import { CampaignBanner } from "@/src/components/campaign/campaign";

export default async function Page(props) {
    const params = await props.params;
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
    const db = getFirestore(firebaseServerApp);

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
            <CampaignBanner initialCampaign={campaign} campaignId={params.id} />
            <div className="row">
                <Panel title="Units" 
                    action={campaign.currentPV && campaign.currentPV <= 0 ? <button type="button" disabled={true} title="No more PV to spend on units">Add Unit</button> : <Link href="roster/addUnit">Add Unit</Link>} 
                    style={{'--primary-color' : '#636466', flexGrow: 1}}>
                    <ForceList
                        initialUnits={campaign.units}
                        campaignId={params.id}
                        campaign={campaign}
                        perUnitActions={unitActions}
                        />
                </Panel>
                <Panel title="Pilots" 
                    action={campaign.pilots?.length >= 6 ? <button type="button" disabled={true} title="Only 6 named pilots allowed in a campaign">Add Pilot</button> : <Link href="roster/addPilot">Add Pilot</Link> } 
                    style={{'--primary-color' : '#E0AD2A'}}>
                    <PilotList 
                        initialPilots={campaign.pilots}
                        campaignId={params.id}
                        perPilotActions={pilotActions}
                    />
                </Panel>
            </div>
        </main>
    );
}