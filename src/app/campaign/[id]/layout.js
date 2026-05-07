import Link from "next/link";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { getCampaignById } from "@/src/components/Campaign/actions";
import { redirect } from "next/navigation";
import Tabs from "@/src/components/ui/tabs/tabs";

export const dynamic = "force-dynamic";

export default async function Layout({ children, params }) {

  const campaignId = await params;
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const campaign = await getCampaignById(
    getFirestore(firebaseServerApp),
    campaignId.id,
    currentUser?.uid
  );

  if (campaign) {
    return (
      <>
        <Tabs links={[
          {href: '/campaign/'+campaignId.id, content: 'Sorties'},
          {href: '/campaign/'+campaignId.id+'/roster', content: 'Force Roster'},
          ]} />
          
        <div id="sp-display">SP: { campaign.currentSP ? campaign.currentSP : campaign.startingSP }</div>
        
        { children }
      </>
    );
  } else {
    redirect('/');
  }
}
