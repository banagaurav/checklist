import { useState } from "react";
import { PlusOutlined, UnorderedListOutlined } from "@ant-design/icons";

export default function Rhs({ onAddHeading, onAddList, hasSelection }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 100, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
      {expanded && (
        <>
          <div
            onClick={() => { setExpanded(false); onAddList(); }}
            style={{
              background: "#722ed1",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: 24,
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: hasSelection ? 1 : 0.4,
              pointerEvents: hasSelection ? "auto" : "none",
            }}
          >
            <UnorderedListOutlined /> Add List
          </div>
          <div
            onClick={() => { setExpanded(false); onAddHeading(); }}
            style={{
              background: "#fff",
              color: "#722ed1",
              padding: "12px 20px",
              borderRadius: 24,
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: "2px solid #722ed1",
            }}
          >
            <PlusOutlined /> Add Heading
          </div>
        </>
      )}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#722ed1",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(114,46,209,0.4)",
          transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
        }}
      >
        <PlusOutlined />
      </div>
    </div>
  );
}
