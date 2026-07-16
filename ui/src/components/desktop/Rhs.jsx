import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const kbd = {
  display: "inline-block",
  marginLeft: 6,
  padding: "0 5px",
  fontSize: 11,
  lineHeight: "18px",
  borderRadius: 4,
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.12)",
  fontFamily: "inherit",
};

const kbdDefault = {
  ...kbd,
  border: "1px solid rgba(0,0,0,0.15)",
  background: "rgba(0,0,0,0.04)",
};

export default function Rhs({ onAddHeading, onAddList, hasSelection }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        disabled={!hasSelection}
        onClick={onAddList}
      >
        Add List <kbd style={kbd}>Alt+L</kbd>
      </Button>
      <Button
        type="default"
        icon={<PlusOutlined />}
        onClick={onAddHeading}
      >
        Add Heading <kbd style={kbdDefault}>Alt+H</kbd>
      </Button>
    </div>
  );
}
