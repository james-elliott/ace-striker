import { Suspense } from "react";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { getCampaignById } from "@/src/components/Campaign/actions";
import { Campaign } from "@/src/components/Campaign/Campaign";

export default async function Home(props) {
  // This is a server component, we can access URL
  // parameters via Next.js and download the data
  // we need for this page
  const params = await props.params;
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const campaign = await getCampaignById(
    getFirestore(firebaseServerApp),
    params.id,
    currentUser?.uid
  );

  return (
    <main className="main__restaurant">
      <Campaign
        id={params.id}
        initialCampaign={campaign}
        initialUserId={currentUser?.uid || ""}
      >
      </Campaign>
    </main>
  );
}