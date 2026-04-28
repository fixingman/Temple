import { useState, useEffect, useCallback } from "react";

const CLIENT_ID = "186862100308-4lfr928avpodulpf4d70m9jteh1qgm2r.apps.googleusercontent.com";
const SCOPE = "https://www.googleapis.com/auth/drive.file";
const FILE_NAME = "temple-backup.json";
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";

export function useGoogleDrive() {
  const [status, setStatus] = useState("idle"); // idle | signing-in | ready | syncing | error
  const [user, setUser] = useState(null);       // { name, email, picture }
  const [message, setMessage] = useState("");
  const [lastSync, setLastSync] = useState(null);
  const [tokenClient, setTokenClient] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Load GIS + GAPI scripts
  useEffect(() => {
    let gapiReady = false;
    let gisReady = false;

    const tryInit = () => {
      if (!gapiReady || !gisReady) return;
      window.gapi.load("client", async () => {
        try {
          await window.gapi.client.init({
            discoveryDocs: [DISCOVERY_DOC],
          });
        } catch (e) {
          console.error("GAPI init error", e);
        }
      });

      const tc = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPE,
        callback: (tokenResponse) => {
          if (tokenResponse.error) {
            setStatus("error");
            setMessage("Sign-in failed. Please try again.");
            return;
          }
          setAccessToken(tokenResponse.access_token);
          // Fetch user info
          fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          })
            .then((r) => r.json())
            .then((info) => {
              setUser({ name: info.name, email: info.email, picture: info.picture });
              setStatus("ready");
              setMessage("");
            })
            .catch(() => {
              setStatus("ready");
              setMessage("");
            });
        },
      });
      setTokenClient(tc);
    };

    // Load GAPI
    if (!window.gapi) {
      const s1 = document.createElement("script");
      s1.src = "https://apis.google.com/js/api.js";
      s1.onload = () => { gapiReady = true; tryInit(); };
      s1.onerror = () => setMessage("Could not load Google API.");
      document.head.appendChild(s1);
    } else {
      gapiReady = true;
    }

    // Load GIS
    if (!window.google?.accounts) {
      const s2 = document.createElement("script");
      s2.src = "https://accounts.google.com/gsi/client";
      s2.onload = () => { gisReady = true; tryInit(); };
      s2.onerror = () => setMessage("Could not load Google Sign-In.");
      document.head.appendChild(s2);
    } else {
      gisReady = true;
      tryInit();
    }
  }, []);

  const signIn = useCallback(() => {
    if (!tokenClient) {
      setMessage("Google Sign-In is still loading. Please wait a moment.");
      return;
    }
    setStatus("signing-in");
    setMessage("");
    tokenClient.requestAccessToken({ prompt: "consent" });
  }, [tokenClient]);

  const signOut = useCallback(() => {
    if (accessToken) {
      window.google?.accounts.oauth2.revoke(accessToken, () => {});
    }
    setAccessToken(null);
    setUser(null);
    setStatus("idle");
    setMessage("");
    setLastSync(null);
  }, [accessToken]);

  // Find existing backup file id
  const findFile = useCallback(async () => {
    const res = await window.gapi.client.drive.files.list({
      q: `name='${FILE_NAME}' and trashed=false`,
      spaces: "drive",
      fields: "files(id,name,modifiedTime)",
    });
    return res.result.files?.[0] || null;
  }, []);

  // Backup: write data to Drive
  const backup = useCallback(async (data) => {
    if (!accessToken) { setMessage("Sign in to Google Drive first."); return false; }
    setStatus("syncing");
    setMessage("Saving to Google Drive...");
    try {
      const content = JSON.stringify({ ...data, _backedUpAt: Date.now() }, null, 2);
      const blob = new Blob([content], { type: "application/json" });
      const existing = await findFile();

      const form = new FormData();
      form.append("metadata", new Blob([JSON.stringify({
        name: FILE_NAME,
        mimeType: "application/json",
      })], { type: "application/json" }));
      form.append("file", blob);

      const url = existing
        ? `https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=multipart`
        : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

      const res = await fetch(url, {
        method: existing ? "PATCH" : "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      });

      if (!res.ok) throw new Error(`Drive error: ${res.status}`);
      const now = new Date();
      setLastSync(now);
      setStatus("ready");
      setMessage(`Saved to Drive — ${now.toLocaleTimeString()}`);
      setTimeout(() => setMessage(""), 4000);
      return true;
    } catch (e) {
      setStatus("ready");
      setMessage("Backup failed. Check your connection and try again.");
      setTimeout(() => setMessage(""), 5000);
      return false;
    }
  }, [accessToken, findFile]);

  // Restore: read data from Drive
  const restore = useCallback(async () => {
    if (!accessToken) { setMessage("Sign in to Google Drive first."); return null; }
    setStatus("syncing");
    setMessage("Loading from Google Drive...");
    try {
      const existing = await findFile();
      if (!existing) {
        setStatus("ready");
        setMessage("No backup found in Google Drive.");
        setTimeout(() => setMessage(""), 4000);
        return null;
      }

      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${existing.id}?alt=media`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!res.ok) throw new Error(`Drive error: ${res.status}`);
      const parsed = await res.json();

      setStatus("ready");
      setMessage("Backup restored from Google Drive.");
      setTimeout(() => setMessage(""), 4000);
      return parsed;
    } catch (e) {
      setStatus("ready");
      setMessage("Restore failed. Check your connection and try again.");
      setTimeout(() => setMessage(""), 5000);
      return null;
    }
  }, [accessToken, findFile]);

  return { status, user, message, lastSync, signIn, signOut, backup, restore };
}
