import { useState, useEffect } from "react";
import { CloseOutlined, EditOutlined, DownOutlined, RightOutlined } from "@ant-design/icons";
import { formatDate } from "../shared/utils";

function HeadingCard({ heading, selectedId, onSelect, onToggleItem, onDeleteItem, onEditItem, onAddListToHeading }) {
  const [open, setOpen] = useState(false);
  const isSelected = selectedId === heading.id;

  return (
    <div style={{ marginBottom: 12, borderRadius: 12, background: isSelected ? "#e6f7ff" : "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      <div
        onClick={() => onSelect(heading.id)}
        style={{
          padding: "14px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          borderBottom: open && heading.items.length > 0 ? "1px solid #f0f0f0" : "none",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{heading.title}</div>
          <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
            Added {formatDate(heading.createdAt)}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {heading.items.length === 0 && (
            <>
              <EditOutlined
                onClick={(e) => { e.stopPropagation(); onEditItem(heading.id); }}
                style={{ color: "#999", cursor: "pointer", fontSize: 16 }}
              />
              <CloseOutlined
                onClick={(e) => { e.stopPropagation(); onDeleteItem(heading.id); }}
                style={{ color: "#999", cursor: "pointer", fontSize: 16 }}
              />
            </>
          )}
          {heading.items.length > 0 && (
            <div onClick={(e) => { e.stopPropagation(); setOpen(!open); }} style={{ cursor: "pointer", color: "#999" }}>
              {open ? <DownOutlined /> : <RightOutlined />}
            </div>
          )}
        </div>
      </div>
      {open && heading.items.length > 0 && (
        <div style={{ padding: "8px 16px 12px" }}>
          {heading.items.map((item) => (
            <div key={item.id} id={`item-${item.id}`} style={{ padding: "10px 0", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #f5f5f5" }}>
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => onToggleItem(heading.id, item.id, item.done)}
                style={{ width: 20, height: 20, cursor: "pointer", flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: item.done ? "#000" : "#555", textDecoration: item.done ? "line-through" : "none" }}>
                  {item.text}
                </div>
                <div style={{ fontSize: 10, color: "#bbb", marginTop: 1 }}>
                  Added {formatDate(item.createdAt)}
                  {item.checkedAt && <> · Checked {formatDate(item.checkedAt)}</>}
                </div>
              </div>
              <EditOutlined
                onClick={() => onEditItem(item.id)}
                style={{ color: "#999", cursor: "pointer", fontSize: 16, flexShrink: 0 }}
              />
              <CloseOutlined
                onClick={() => onDeleteItem(heading.id, item.id)}
                style={{ color: "#999", cursor: "pointer", fontSize: 16, flexShrink: 0 }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Lhs({ headings = [], selectedId, onSelect, onToggleItem, onDeleteItem, onEditItem, onAddListToHeading }) {
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
    <div style={{ padding: "80px 16px 100px" }}>
      {headings.length === 0 ? (
        <p style={{ color: "#999", textAlign: "center", marginTop: 60 }}>No headings yet</p>
      ) : (
        headings.map((h) => (
          <HeadingCard
            key={h.id}
            heading={h}
            selectedId={selectedId}
            onSelect={onSelect}
            onToggleItem={onToggleItem}
            onDeleteItem={onDeleteItem}
            onEditItem={onEditItem}
            onAddListToHeading={onAddListToHeading}
          />
        ))
      )}
    </div>
  );
}
