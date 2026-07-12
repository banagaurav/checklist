import { useEffect } from "react";
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import { formatDate } from "../shared/utils";

export default function Lhs({ headings = [], selectedId, onSelect, onToggleItem, onDeleteItem, onDeleteHeading, onEditHeading, onEditItem, onAddListToHeading }) {
  useEffect(() => {
    for (const h of headings) {
      for (const item of h.items) {
        if (!item.done) {
          const el = document.getElementById(`item-${item.id}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
      }
    }
  }, [headings]);

  return (
    <div style={{ backgroundColor: "#e6f7ff", height: "100%", padding: 24, borderRadius: 8, overflowY: "auto" }}>
      {headings.length === 0 ? (
        <p style={{ color: "#999" }}>No headings yet</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {headings.map((h) => (
            <li key={h.id}>
              <div
                id={`heading-${h.id}`}
                onClick={() => onSelect(h.id)}
                onDoubleClick={() => onAddListToHeading(h.id)}
                style={{
                  padding: "8px 12px",
                  marginBottom: 4,
                  borderRadius: 4,
                  cursor: "pointer",
                  backgroundColor: selectedId === h.id ? "#bae7ff" : "transparent",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  {h.title}
                  <div style={{ fontSize: 11, color: "#999", fontWeight: "normal", marginTop: 2 }}>
                    Added {formatDate(h.createdAt)}
                  </div>
                </div>
                {h.items.length === 0 && (
                  <div style={{ display: "flex", gap: 16 }}>
                    <EditOutlined
                      onClick={(e) => { e.stopPropagation(); onEditHeading(h.id); }}
                      style={{ color: "#999", cursor: "pointer", fontSize: 12, marginTop: 4 }}
                    />
                    <CloseOutlined
                      onClick={(e) => { e.stopPropagation(); onDeleteHeading(h.id); }}
                      style={{ color: "#999", cursor: "pointer", fontSize: 12, marginTop: 4 }}
                    />
                  </div>
                )}
              </div>
              {h.items.length > 0 && (
                <ul style={{ listStyle: "none", padding: "0 0 0 24px", margin: "0 0 8px 0" }}>
                  {h.items.map((item) => (
                    <li key={item.id} id={`item-${item.id}`} style={{ padding: "4px 0", display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => onToggleItem(h.id, item.id, item.done)}
                        style={{ marginTop: 3 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: item.done ? "#000" : "#888" }}>
                          {item.text}
                        </div>
                        <div style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>
                          Added {formatDate(item.createdAt)}
                          {item.checkedAt && <> · Checked {formatDate(item.checkedAt)}</>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                        <EditOutlined
                          onClick={() => onEditItem(item.id)}
                          style={{ color: "#999", cursor: "pointer", fontSize: 12 }}
                        />
                        <CloseOutlined
                          onClick={() => onDeleteItem(h.id, item.id)}
                          style={{ color: "#999", cursor: "pointer", fontSize: 12 }}
                        />
                      </div>
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
