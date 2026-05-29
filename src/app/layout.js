import "@/src/app/styles.css";
import Header from "@/src/components/ui/header/header.jsx";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp";
import { getFirestore } from "firebase/firestore";
import { getCampaigns } from "../components/campaign/actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ace Striker",
  description:
    "A BattleTech Aces companion for tracking campaigns.",
};

export default async function RootLayout({ children, modals }) {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();

  let header = <Header />;
  if (currentUser) {
    const campaigns = await getCampaigns(getFirestore(firebaseServerApp), currentUser?.uid);
    header = <Header initialUser={currentUser?.toJSON()} initialCampaigns={campaigns} />;
  }

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <link href="https://fonts.googleapis.com/css2?family=Anta&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {header}
        {children}
        {modals}
      </body>
    </html>
  );
}
