import Link from "next/link";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { PilotList } from "@/src/components/pilots/pilots";
import { ForceList } from "@/src/components/units/units";
import { getCampaignById } from "@/src/components/campaign/actions";
import Panel from "@/src/components/ui/panel/panel";

export default async function Page(props) {
    const params = await props.params;
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
    const db = getFirestore(firebaseServerApp);

    const campaign = await getCampaignById(db, params.id, currentUser?.uid);

    let unitActionText =  'Purchase Unit';
    let pilotActionText = 'Hire Pilot';
    if (campaign.status == 'preparing') {
        unitActionText = 'Add Unit';
        pilotActionText = 'Add Pilot';
    } 

    return (
        <main className="roster">
            <div className="row">
                <Panel title="Units" 
                    action={campaign.currentPV && campaign.currentPV <= 0 ? <button type="button" disabled={true} title="No more PV to spend on units">{unitActionText}</button> : <Link href="roster/addUnit">{unitActionText}</Link>} 
                    style={{'--primary-color' : '#636466', flexGrow: 1}}>
                    <ForceList
                        campaignId={params.id}
                        initialCampaign={campaign}
                        />
                </Panel>
                <Panel title="Pilots" 
                    action={campaign.pilots?.length >= 6 ? <button type="button" disabled={true} title="Only 6 named pilots allowed in a campaign">{pilotActionText}</button> : <Link href="roster/addPilot">{pilotActionText}</Link> } 
                    style={{'--primary-color' : '#E0AD2A'}}>
                    <PilotList 
                        initialCampaign={campaign}
                        campaignId={params.id}
                    />
                </Panel>
            </div>
        </main>
    );
}