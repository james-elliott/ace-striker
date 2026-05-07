import "./stats.css";

export function StatPair({label, values = []}) {
  return <span className="stat">{label}: <em>{values}</em></span>;
}

export function StatBox( {label, children }) {

  // wrapper, title, contentbox

  return (
    <div className="stat-box">
      <div className="title">{label}</div>
      <div className="content">
        {children}
      </div>
    </div>
  );
}