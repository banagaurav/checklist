import { useState } from "react";
import { Modal, Input } from "antd";

export default function AddItemModal({ open, onClose, onConfirm, headingName }) {
  const [value, setValue] = useState("");

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
      title={headingName ? `Add item to "${headingName}"` : "Add Item"}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Add"
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
