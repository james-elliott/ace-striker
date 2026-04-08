import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { CampaignList } from "@/src/components/Campaign/Campaign";
import RestaurantListings from "../components/RestaurantListings";
import { getRestaurants } from "../lib/firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getCampaigns } from "../components/Campaign/actions";

// Force next.js to treat this route as server-side rendered
// Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it

export const dynamic = "force-dynamic";

// This line also forces this route to be server-side rendered
// export const revalidate = 0;

export default async function Home(props) {
  const searchParams = await props.searchParams;
  // Using seachParams which Next.js provides, allows the filtering to happen on the server-side, for example:
  // ?city=London&category=Indian&sort=Review
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const restaurants = await getRestaurants(
    getFirestore(firebaseServerApp),
    searchParams
  );
  const campaigns = await getCampaigns(
    getFirestore(firebaseServerApp),
    currentUser?.uid
  );
  return (
    <main className="main__home">
      {/* if the user is in the allowed list, let them see stuff, otherwise have them sign up. If signed up, show them they are waiting.
      
      Show them a list of campaigns, if none, show placeholder. @todo take them to the last accessed one automatically.
      
      */}
      { currentUser ? (
      <CampaignList 
        initialCampaigns={campaigns}
        initialUser={currentUser.toJSON()}
      /> ) : null
      }
      {/* <RestaurantListings
        initialRestaurants={restaurants}
        searchParams={searchParams}
      /> */}
    </main>
  );
}
