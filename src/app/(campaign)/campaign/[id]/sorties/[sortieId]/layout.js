export const dynamic = "force-dynamic";

export default async function Layout({ children, modals }) {

  return (
    <>
      { children }
      { modals }
    </>
  );
}
