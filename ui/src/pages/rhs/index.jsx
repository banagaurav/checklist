import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function Rhs({ onAddHeading, onAddList, hasSelection }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        disabled={!hasSelection}
        onClick={() => {
          const text = prompt("Enter list item:");
          if (text && text.trim()) {
            onAddList(text.trim());
          }
        }}
      >
        Add List
      </Button>
      <Button
        type="default"
        icon={<PlusOutlined />}
        onClick={() => {
          const title = prompt("Enter heading name:");
          if (title && title.trim()) {
            onAddHeading(title.trim());
          }
        }}
      >
        Add Heading
      </Button>
    </div>
  );
}
