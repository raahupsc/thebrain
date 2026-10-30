export default function BarChart({ rows, unit = "" }) {
  const mx = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <div>
      {rows.map((r, i) => (
        <div className="hbar" key={i}>
          <span className="hbar-l">{r[0]}</span>
          <span className="hbar-t"><span className="hbar-f" style={{ width: Math.round((r[1] / mx) * 100) + "%" }} /></span>
          <span className="hbar-v">{r[1]}{unit}</span>
        </div>
      ))}
    </div>
  );
}
