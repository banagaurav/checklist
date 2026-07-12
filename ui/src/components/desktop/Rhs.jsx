import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function Rhs({ onAddHeading, onAddList, hasSelection }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        disabled={!hasSelection}
        onClick={onAddList}
      >
        Add List
      </Button>
      <Button
        type="default"
        icon={<PlusOutlined />}
        onClick={onAddHeading}
      >
        Add Heading
      </Button>
    </div>
  );
}
