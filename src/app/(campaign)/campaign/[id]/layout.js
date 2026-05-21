import Link from "next/link";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { getCampaignById } from "@/src/components/campaign/actions";
import { redirect } from "next/navigation";
import Tabs from "@/src/components/ui/tabs/tabs";
import { CampaignResources } from "@/src/components/campaign/campaign";

export const dynamic = "force-dynamic";

export default async function Layout({ children, params, modals }) {

  const props = await params;
  const campaignId = props.id;
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const campaign = await getCampaignById(
    getFirestore(firebaseServerApp),
    campaignId,
    currentUser?.uid
  );

  if (!campaign) {
    redirect('/');
  }

  if (campaign) {
    return (
      <>
        <Tabs>
          <Link href={'/campaign/'+campaignId}>Sorties</Link>
          <CampaignResources initialCampaign={campaign} campaignId={campaignId} />
          <Link href={'/campaign/'+campaignId+'/roster'}>Force Roster</Link>
        </Tabs>
        { children }
        { modals }
      </>
    );
  }
}
