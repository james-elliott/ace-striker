import { AddUnitForm } from "@/src/components/units/units";

export default async function Page(props) {
  const params = await props.params;

  return (
    <main className="home">
      <AddUnitForm campaignId={params.id} />
    </main>
  );
}