import { AddUnitForm } from "@/src/components/units/units";

export default async function Page(props) {
  const params = await props.params;

  return (
    <main className="home">
      <p>This is where I'm going to add Units.</p>
      <p>First we need to build a tool to query MUL, we're giong to take from Jeff's Tools.</p>
      <p>Then, when we render them, we'll add an action that can add them to the current force.</p>
      <p>We'll re-use this when we go to add OpFor to Sorties.</p>
      <AddUnitForm campaignId={params.id} />
    </main>
  );
}