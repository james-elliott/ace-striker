import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { CampaignList } from "@/src/components/campaign/campaign";
import { getFirestore } from "firebase/firestore";
import { getCampaigns } from "../components/campaign/actions";

export const dynamic = "force-dynamic";

export default async function Home(props) {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const campaigns = await getCampaigns(
    getFirestore(firebaseServerApp),
    currentUser?.uid
  );
  return (
    <main className="home">
      {/* if the user is in the allowed list, let them see stuff, otherwise have them sign up. If signed up, show them they are waiting.
      
      Show them a list of campaigns, if none, show placeholder. @todo take them to the last accessed one automatically.
      
      */}
      { currentUser ? (
      <CampaignList 
        initialCampaigns={campaigns}
        initialUser={currentUser.toJSON()}
      /> ) : null
      }
    </main>
  );
}
