"use client";

// This components shows one individual restaurant
// It receives data from src/app/restaurant/[id]/page.jsx

import { React, useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getRestaurantSnapshotById } from "@/src/lib/firebase/firestore.js";
import { useUser } from "@/src/lib/getUser";
import RestaurantDetails from "@/src/components/RestaurantDetails.jsx";
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
import { db } from "@/src/lib/firebase/clientApp";

export default function Restaurant({
  id,
  initialRestaurant,
  initialUserId,
  children,
}) {
  const [restaurantDetails, setRestaurantDetails] = useState(initialRestaurant);
  const [editing, setEditing] = useState(false);

  // The only reason this component needs to know the user ID is to associate a review with the user, and to know whether to show the review dialog
  const userId = useUser()?.uid || initialUserId;
  const [review, setReview] = useState({
    rating: 0,
    text: "",
  });

  const onChange = (value, name) => {
    setReview({ ...review, [name]: value });
  };

  async function handleRestaurantImage(target) {
    const image = target.files ? target.files[0] : null;
    if (!image) {
      return;
    }

    const imageURL = await updateRestaurantImage(id, image);
    setRestaurantDetails({ ...restaurantDetails, photo: imageURL });
  }

  const handleClose = () => {
    setIsOpen(false);
    setReview({ rating: 0, text: "" });
  };

  useEffect(() => {
    return getRestaurantSnapshotById(id, (data) => {
      setRestaurantDetails(data);
    });
  }, [id]);

  return (
    <>
      <RestaurantDetails
        restaurant={restaurantDetails}
        userId={userId}
        handleRestaurantImage={handleRestaurantImage}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        {children}
      </RestaurantDetails>
    </>
  );
}

export function PilotListing({
  initialPilots,
  searchParams,
}) {
  const router = useRouter();

  // The initial filters are the search params from the URL, useful for when the user refreshes the page
  // const initialFilters = {
  //   city: searchParams.city || "",
  //   category: searchParams.category || "",
  //   price: searchParams.price || "",
  //   sort: searchParams.sort || "",
  // };
  const initialFilters = {};

  const [pilots, setPilots] = useState(initialPilots);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    routerWithFilters(router, filters);
  }, [router, filters]);

  useEffect(() => {
    return getPilots((data) => {
      setPilots(data);
    }, filters);
  }, [filters]);

  return (
    <article>
      <ul className="pilots">
        These are pilots
      </ul>
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

function getPilots(cb, filters = {}) {
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  let q = query(collection(db, "pilots"));

  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        // Only plain objects can be passed to Client Components from Server Components
        timestamp: doc.data().timestamp.toDate(),
      };
    });

    cb(results);
  });
}
