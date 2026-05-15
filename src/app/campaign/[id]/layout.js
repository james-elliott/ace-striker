import Link from "next/link";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { getCampaignById } from "@/src/components/campaign/actions";
import { redirect } from "next/navigation";
import Tabs from "@/src/components/ui/tabs/tabs";
import { getUnits } from "@/src/components/units/actions";

export const dynamic = "force-dynamic";

export default async function Layout({ children, params, modals }) {

  const campaignId = await params;
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const campaign = await getCampaignById(
    getFirestore(firebaseServerApp),
    campaignId.id,
    currentUser?.uid
  );

  if (!campaign) {
    redirect('/');
  }

  const units = await getUnits(getFirestore(firebaseServerApp), campaignId.id, currentUser?.uid);

  let forcePV = 0;
  for(let unit of units) {
    forcePV += unit.pv;
  }

  if (campaign) {
    return (
      <>
        {campaign.status !== 'preparing' ? <>
        <Tabs>
          <Link href={'/campaign/'+campaignId.id}>Sorties</Link>
          <div id="sp-display">SP: { campaign.currentSP ? campaign.currentSP : campaign.startingSP }</div>
          <Link href={'/campaign/'+campaignId.id+'/roster'}>Force Roster</Link>
        </Tabs>
          
        </> : 
        <>
          <Tabs>
            <div id="sp-display">Remaining PV for units: { campaign.startingPV - forcePV }</div>            
          </Tabs>
        </> }
        { children }
        { modals }
      </>
    );
  }
}
