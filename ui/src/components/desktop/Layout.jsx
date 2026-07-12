export default function DesktopLayout({ topBar, children }) {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10, display: "flex", justifyContent: "flex-end", padding: 16, gap: 8, background: "#fff" }}>
        {topBar}
      </div>
      <div style={{ flex: 1, padding: "0 24px 24px" }}>
        {children}
      </div>
    </div>
  );
}
