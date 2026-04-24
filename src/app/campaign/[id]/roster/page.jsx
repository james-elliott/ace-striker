import Link from "next/link";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { getCampaignById } from "@/src/components/Campaign/actions";
import { PilotList } from "@/src/components/Pilots/Pilots";

export default async function Page(props) {
    const params = await props.params;

    console.log(params.id);

    return (
        <>
            This is where we list out our roster of units and pilots
            <Link href="roster/addPilot">Add Pilot</Link>
            <PilotList 
                initialPilots={''}
                campaignId={params.id} 
            />
        </>
    );
}