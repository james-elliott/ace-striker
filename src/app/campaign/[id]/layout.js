import Link from "next/link";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { getCampaignById } from "@/src/components/Campaign/actions";
import { redirect } from "next/navigation";

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
        <nav className="tabs">
          <Link href={'/campaign/'+ campaignId.id}>Sorties</Link>
          <span>{ campaign.currentSP ? campaign.currentSP : campaign.startingSP }</span>
          <Link href={'/campaign/'+ campaignId.id + '/roster'}>Force Roster</Link>
        </nav>
        { children }
      </>
    );
  } else {
    redirect('/');
  }
}
