"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  signInWithGoogle,
  signOut,
  onIdTokenChanged,
} from "@/src/lib/firebase/auth.js";
import { setCookie, deleteCookie } from "cookies-next";
import { getUserSnapshotById } from "@/src/lib/firebase/firestore.js";
import { getCampaignSnapshotById } from "../Campaign/Campaign";
import './Header.css';
import { useSelectedLayoutSegments } from "next/navigation";
import { db } from "@/src/lib/firebase/clientApp";
import { getCampaignById } from "../Campaign/actions";

function useUserSession(initialUser) {
  useEffect(() => {
    return onIdTokenChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        await setCookie("__session", idToken);
      } else {
        await deleteCookie("__session");
      }
      if (initialUser?.uid === user?.uid) {
        return;
      }
      window.location.reload();
    });
  }, [initialUser]);

  return initialUser;
}

export default function Header({ initialUser, campaigns }) {
  const user = useUserSession(initialUser);
  const segments = useSelectedLayoutSegments();
  const [campaign, setCampaign] = useState();

  useEffect(() => {
    return getCampaignSnapshotById(segments[1], (data) => {
      setCampaign(data);
    });
  }, [segments[1]]);

  const handleSignOut = (event) => {
    event.preventDefault();
    signOut();
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    signInWithGoogle();
  };

  return (
    <header>
      <div className="shape"></div>
      
      
      <div className="menu">
        <button popoverTarget="main-menu" disabled={!user} popoverTargetAction="toggle" className="material-symbols-outlined">menu</button>
        <ul id="main-menu" popover="auto">
          {campaigns?.length > 0 ? campaigns.map((campaign) => (
            <li key={campaign.id}>
              <Link href={`/campaign/${campaign.id}`}>
                {campaign.name}
              </Link>
            </li>
          )) : <li><span>No Campaigns</span></li> }
          <hr />
          <li>
            <Link href="/addCampaign">New Campaign</Link>
          </li>
        </ul>
      </div>

      <Link href="/" className="logo">Ace Striker</Link>

      <div className="menu">
        <button popoverTarget="user-menu" popoverTargetAction="toggle" className="material-symbols-outlined">
          {user ? (<img
            className="profileImage"
            src={user.photoURL || "/profile.svg"}
            alt={user.email}
          />) : <>account_circle</> }
        </button>
        <ul id="user-menu" popover="auto">
          <li>
            {user ? (
              <a href="#" onClick={handleSignOut}>
                Sign Out
              </a>
            ) : (
              <a href="#" onClick={handleSignIn}>
                Sign In with Google
              </a>
            )}
          </li>
        </ul>
      </div>

    </header>
  );
}
