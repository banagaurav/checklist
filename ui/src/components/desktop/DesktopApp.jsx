import { useState, useEffect } from "react";
import { Modal } from "antd";
import Rhs from "./Rhs";
import Lhs from "./Lhs";
import Layout from "./Layout";
import AddHeadingModal from "../shared/AddHeadingModal";
import AddItemModal from "../shared/AddItemModal";
import EditHeadingModal from "../shared/EditHeadingModal";
import EditItemModal from "../shared/EditItemModal";
import { loadHeadings, saveHeadings } from "@/lib/db";

export default function DesktopApp() {
  const [headings, setHeadings] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [headingModalOpen, setHeadingModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [itemModalHeadingId, setItemModalHeadingId] = useState(null);
  const [editHeadingId, setEditHeadingId] = useState(null);
  const [editItemKey, setEditItemKey] = useState(null);

  useEffect(() => {
    const migrate = async () => {
      const fromLS = localStorage.getItem("checklist-headings");
      if (fromLS) {
        try {
          const parsed = JSON.parse(fromLS);
          if (Array.isArray(parsed) && parsed.length > 0) {
            await saveHeadings(parsed);
            setHeadings(parsed);
          }
        } catch {}
        localStorage.removeItem("checklist-headings");
        return;
      }
      const fromDB = await loadHeadings();
      setHeadings(fromDB);
    };
    migrate();
  }, []);

  useEffect(() => {
    if (headings.length > 0) saveHeadings(headings);
  }, [headings]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === "l") {
        e.preventDefault();
        if (selectedId) openItemModal(selectedId);
      }
      if (e.altKey && e.key === "h") {
        e.preventDefault();
        setHeadingModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  const addHeading = (title) => {
    const newHeading = { id: Date.now(), title, createdAt: new Date().toISOString(), items: [] };
    setHeadings((prev) => [...prev, newHeading]);
  };

  const editHeading = (headingId, title) => {
    setHeadings((prev) => prev.map((h) => (h.id === headingId ? { ...h, title } : h)));
  };

  const addListItemToHeading = (headingId, text) => {
    if (!text || !text.trim()) return;
    setHeadings((prev) =>
      prev.map((h) =>
        h.id === headingId
          ? { ...h, items: [...h.items, { id: Date.now(), text: text.trim(), done: false, createdAt: new Date().toISOString(), checkedAt: null }] }
          : h
      )
    );
  };

  const toggleItem = (headingId, itemId, currentlyDone) => {
    if (currentlyDone) {
      Modal.confirm({
        title: "Uncheck item?",
        content: "Are you sure you want to uncheck this item?",
        okText: "Yes, uncheck",
        cancelText: "Cancel",
        onOk: () => {
          setHeadings((prev) =>
            prev.map((h) =>
              h.id === headingId
                ? { ...h, items: h.items.map((item) => item.id === itemId ? { ...item, done: false, checkedAt: null } : item) }
                : h
            )
          );
        },
      });
    } else {
      setHeadings((prev) =>
        prev.map((h) =>
          h.id === headingId
            ? { ...h, items: h.items.map((item) => item.id === itemId ? { ...item, done: true, checkedAt: new Date().toISOString() } : item) }
            : h
        )
      );
    }
  };

  const deleteItem = (headingId, itemId) => {
    setHeadings((prev) => prev.map((h) => h.id === headingId ? { ...h, items: h.items.filter((item) => item.id !== itemId) } : h));
  };

  const deleteHeading = (headingId) => {
    setHeadings((prev) => prev.filter((h) => h.id !== headingId));
  };

  const editItem = (headingId, itemId, text) => {
    setHeadings((prev) => prev.map((h) => h.id === headingId ? { ...h, items: h.items.map((item) => item.id === itemId ? { ...item, text } : item) } : h));
  };

  const openItemModal = (headingId) => {
    setItemModalHeadingId(headingId);
    setItemModalOpen(true);
  };

  const selectedItem = editItemKey
    ? (() => { for (const h of headings) { const item = h.items.find((i) => i.id === editItemKey); if (item) return { headingId: h.id, text: item.text }; } return null; })()
    : null;

  return (
    <Layout
      topBar={
        <Rhs onAddHeading={() => setHeadingModalOpen(true)} onAddList={() => openItemModal(selectedId)} hasSelection={!!selectedId} />
      }
    >
      <Lhs headings={headings} selectedId={selectedId} onSelect={setSelectedId} onToggleItem={toggleItem} onDeleteItem={deleteItem} onDeleteHeading={deleteHeading} onEditHeading={(id) => setEditHeadingId(id)} onEditItem={(itemId) => setEditItemKey(itemId)} onAddListToHeading={openItemModal} />

      <AddHeadingModal open={headingModalOpen} onClose={() => setHeadingModalOpen(false)} onConfirm={addHeading} />
      <AddItemModal open={itemModalOpen} onClose={() => setItemModalOpen(false)} onConfirm={(text) => { addListItemToHeading(itemModalHeadingId, text); }} headingName={headings.find((h) => h.id === itemModalHeadingId)?.title} />
      <EditHeadingModal open={editHeadingId !== null} onClose={() => setEditHeadingId(null)} onConfirm={(title) => { editHeading(editHeadingId, title); setEditHeadingId(null); }} initialValue={headings.find((h) => h.id === editHeadingId)?.title} />
      <EditItemModal open={editItemKey !== null} onClose={() => setEditItemKey(null)} onConfirm={(text) => { if (selectedItem) { editItem(selectedItem.headingId, editItemKey, text); setEditItemKey(null); } }} initialValue={selectedItem?.text} />
    </Layout>
  );
}
