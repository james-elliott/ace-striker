"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  signInWithGoogle,
  signOut,
  onIdTokenChanged,
} from "@/src/lib/firebase/auth.js";
import { setCookie, deleteCookie } from "cookies-next";
import { getCampaignsSnapshot } from "../../campaign/campaign";
import './header.css';

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

export default function Header({ initialUser, initialCampaigns }) {
  const user = useUserSession(initialUser);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const campaignMenu = useRef();

  useEffect(() => {
    return getCampaignsSnapshot((data) => {
      setCampaigns(data);
    }, user?.uid);
  },[user]);

  const handleSignOut = (event) => {
    event.preventDefault();
    signOut();
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    signInWithGoogle();
  };

  const hideMenus = () => {
    campaignMenu.current.hidePopover();
  }

  return (
    <header>
      <div className="shape"></div>
      <div className="menu">
        <button popoverTarget="main-menu" disabled={!user} className="material-symbols-outlined">menu</button>
        <ul id="main-menu" popover="auto" className="popover" ref={campaignMenu}>
          {campaigns?.length > 0 ? campaigns.map((campaign) => (
            <li key={campaign.id}>
              <Link href={campaign.status == 'preparing' ? `/campaign/${campaign.id}/roster` : `/campaign/${campaign.id}`} onClick={hideMenus}>
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

      {/* { campaign ? <span>{campaign.name}</span> : null } */}

      <Link href="/" className="logo">Ace Striker</Link>

      {/* { campaign ? <span>{ campaign.forceName }</span> : null } */}

      <div className="menu">
        <button popoverTarget="user-menu" className="material-symbols-outlined">
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
