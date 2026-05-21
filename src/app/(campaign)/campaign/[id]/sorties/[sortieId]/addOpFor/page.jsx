import { AddOpForToSortieForm } from "@/src/components/sorties/sorties";

export default async function Page(props) {
  const params = await props.params;

  return (
    <main className="home">
      <AddOpForToSortieForm campaignId={params.id} sortieId={params.sortieId} />
    </main>
  );
}