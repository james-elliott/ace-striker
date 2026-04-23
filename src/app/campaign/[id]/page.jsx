import { Suspense } from "react";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";
import { getCampaignById } from "@/src/components/Campaign/actions";
import { Campaign } from "@/src/components/Campaign/Campaign";
import { redirect } from "next/dist/server/api-utils";

export default async function Page(props) {
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
    <main>
      <Campaign
        id={params.id}
        initialCampaign={campaign}
        initialUserId={currentUser?.uid || ""}
      >
      </Campaign>
    </main>
  );
}