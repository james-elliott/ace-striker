import { AddUnitForm } from "@/src/components/units/units";
import React from "react";

export default async function Page(props) {
  const params = await props.params;
  
  return (
    <>
      <div className="shim"></div>
      <dialog open={true}>
        <AddUnitForm campaignId={params.id} />
      </dialog>
    </>
  );
}