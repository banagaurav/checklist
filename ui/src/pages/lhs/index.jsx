export default function Lhs({ headings = [], selectedId, onSelect }) {
  return (
    <div style={{ backgroundColor: "#e6f7ff", height: "100%", padding: 24, borderRadius: 8 }}>
      <h2>Headings</h2>
      {headings.length === 0 ? (
        <p style={{ color: "#999" }}>No headings yet</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {headings.map((h) => (
            <li key={h.id}>
              <div
                onClick={() => onSelect(h.id)}
                style={{
                  padding: "8px 12px",
                  marginBottom: 4,
                  borderRadius: 4,
                  cursor: "pointer",
                  backgroundColor: selectedId === h.id ? "#bae7ff" : "transparent",
                  fontWeight: "bold",
                }}
              >
                {h.title}
              </div>
              {h.items.length > 0 && (
                <ul style={{ listStyle: "none", padding: "0 0 0 24px", margin: "0 0 8px 0" }}>
                  {h.items.map((item) => (
                    <li key={item.id} style={{ padding: "4px 0", color: "#555" }}>
                      • {item.text}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
