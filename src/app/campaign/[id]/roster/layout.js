export const dynamic = "force-dynamic";

export default async function Layout({ children, params, modals }) {

  return (
    <>
      { children }
      { modals }
    </>
  );
}
