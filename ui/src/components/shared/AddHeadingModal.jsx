import { useState } from "react";
import { Modal, Input } from "antd";

export default function AddHeadingModal({ open, onClose, onConfirm }) {
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
      title="Add Heading"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Add"
      okButtonProps={{ disabled: !value.trim() }}
    >
      <Input
        placeholder="Enter heading name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={handleOk}
        autoFocus
      />
    </Modal>
  );
}
