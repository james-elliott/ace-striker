import Link from "next/link";
import { PilotList } from "@/src/components/Pilots/Pilots";

export default async function Page(props) {
    const params = await props.params;

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