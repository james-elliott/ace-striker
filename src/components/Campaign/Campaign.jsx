"use client";

// This components handles the Campaign objects
// It receives data from src/app/page.jsx, such as the initial campaigns and search params from the URL

import Link from "next/link";
import { React, useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  onSnapshot,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  Timestamp,
  runTransaction,
  where,
  addDoc,
  getFirestore,
} from "firebase/firestore";
import { db, auth } from "@/src/lib/firebase/clientApp";
import { useUser } from "@/src/lib/getUser";
import CampaignDialog from "./CampaignDialog";

export function CampaignList({initialCampaigns, searchParams, initialUser}) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  
  const userId = initialUser.uid;
  const [campaign, setCampaign] = useState({
    name: "",
    startingBV: 400,
    difficulty: 1.0,
    startingSP: 400,
  });

  const onChange = (value, name) => {
    setCampaign({ ...campaign, [name]: value });
  };

  const handleClose = () => {
    setIsOpen(false);
    setCampaign({
      name: "",
      startingBV: 400,
      difficulty: 1.0,
      startingSP: 400,
    });
  };

  // The initial filters are the search params from the URL, useful for when the user refreshes the page
  const initialFilters = searchParams ? {
    // When adding Campaign filters, put the initialization here.
    // city: searchParams.city || "",
    // category: searchParams.category || "",
    // price: searchParams.price || "",
    // sort: searchParams.sort || "",
  } : {};

  const [filters, setFilters] = useState({});

  const [campaigns, setCampaigns] = useState(initialCampaigns);

  useEffect(() => {
    routerWithFilters(router, filters);
  }, [router, filters]);

  useEffect(() => {
    return getCampaignsSnapshot((data) => {
      setCampaigns(data);
    }, filters, userId);
  }, [filters]);

  return (
    <article>
      <h1>Hello World, I'm a campaign listing.
        <div className="actions">
          {userId && (
            <img
              alt="review"
              className="review"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              src="/review.svg"
            />
          )}
        </div>
      </h1>
      <ul className="campaigns">
        {campaigns?.map ? campaigns.map((campaign) => (
          <p key={campaign.id}>{campaign.name}</p>
        )) : "Loading Campaigns..." }
      </ul>
      {userId && (
        <Suspense fallback={<p>Loading...</p>}>
          <CampaignDialog
            isOpen={isOpen}
            handleClose={handleClose}
            campaign={campaign}
            onChange={onChange}
            userId={userId}
          />
        </Suspense>
      )}
    </article>
  );
}

function routerWithFilters(router, filters) {
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  }

  const queryString = queryParams.toString();
  router.push(`?${queryString}`);
}

export function getCampaignsSnapshot(cb, filters = {}, uid) {
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }
  if (uid == null) {
    console.log('no user id');
    return;
  }
  let q = query(collection(db, "campaigns"));

  // Here we can filter the query to only return campaigns that the user owns.
  q = query(q, where("users", "array-contains", uid));

  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        // Only plain objects can be passed to Client Components from Server Components
        timestamp: doc.data().timestamp?.toDate(),
      };
    });

    cb(results);
  });
}