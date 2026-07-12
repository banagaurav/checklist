import { useState, useEffect } from "react";
import { Modal, Input } from "antd";

export default function EditItemModal({ open, onClose, onConfirm, initialValue }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) setValue(initialValue || "");
  }, [open, initialValue]);

  const handleOk = () => {
    if (value.trim()) {
      onConfirm(value.trim());
      setValue("");
    }
  };

  const handleCancel = () => {
    setValue("");
    onClose();
  };

  return (
    <Modal
      title="Edit Item"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Save"
      okButtonProps={{ disabled: !value.trim() }}
    >
      <Input
        placeholder="Enter list item"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={handleOk}
        autoFocus
      />
    </Modal>
  );
}
