import { useState, useEffect } from "react";
import Rhs from "./rhs";
import Lhs from "./lhs";

const STORAGE_KEY = "checklist-headings";

export default function Home() {
  const [headings, setHeadings] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setHeadings(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(headings));
  }, [headings]);

  const addHeading = (title) => {
    const newHeading = { id: Date.now(), title, createdAt: new Date().toISOString(), items: [] };
    setHeadings((prev) => [...prev, newHeading]);
  };

  const addListItem = (text) => {
    if (!selectedId) return;
    setHeadings((prev) =>
      prev.map((h) =>
        h.id === selectedId
          ? { ...h, items: [...h.items, { id: Date.now(), text, done: false }] }
          : h
      )
    );
  };

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      <div style={{ flex: 1, padding: 24 }}>
        <Lhs headings={headings} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 24 }}>
        <Rhs onAddHeading={addHeading} onAddList={addListItem} hasSelection={!!selectedId} />
      </div>
    </div>
  );
}
