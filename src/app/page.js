import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { CampaignList } from "@/src/components/campaign/campaign";
import { getFirestore } from "firebase/firestore";
import { getCampaigns } from "../components/campaign/actions";
import { SignInWithGoogleLink } from "../components/ui/header/header";

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
      { currentUser ? 
      <CampaignList 
        initialCampaigns={campaigns}
        initialUser={currentUser.toJSON()}
      /> 
      :
      <div>
        <h1>Welcome to Ace Striker</h1>
        <p>This is a tool inspired by Jeff's BattleTech Tools.</p>
        <p>Ace Striker is a companion app that helps players by being a digital record keeper for their BattleTech Aces campaigns.
          It allows you to create your force, hire pilots, set up sorties, and play them. While you can automate rolls with the app
          it also allows for manually entering roll numbers so you don't miss out on the tactile joy of playing BattleTech.
        </p>
        <p>Right now, only Sign In via Google accounts is enabled. <SignInWithGoogleLink /></p>
      </div>
      }
    </main>
  );
}
