import { ConfigProvider, theme, App as AntApp } from "antd";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "@/styles/globals.css";

const { defaultAlgorithm, darkAlgorithm } = theme;

const AUTH_PATHS = ["/auth/login"];
const isAuthPath = (path) => AUTH_PATHS.some((p) => path.startsWith(p));

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const path = router.pathname;
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          const prefs =
            typeof user.preferences === "string"
              ? JSON.parse(user.preferences)
              : user.preferences || {};
          setIsDark(prefs.darkMode === true);
        }
      } catch {}
    }
  }, []);

  const themeConfig = { algorithm: isDark ? darkAlgorithm : defaultAlgorithm };

  return (
    <ConfigProvider theme={themeConfig}>
      <AntApp>
        <AuthProvider>
          <ThemeProvider isDark={isDark} onDarkChange={setIsDark}>
            <ConfigProvider
              theme={{
                token: { colorPrimary: "#722ed1" },
              }}
            >
              {isAuthPath(path) ? (
                <Component {...pageProps} />
              ) : (
                <Component {...pageProps} />
              )}
            </ConfigProvider>
          </ThemeProvider>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  );
}
