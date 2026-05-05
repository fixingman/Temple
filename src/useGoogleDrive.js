import { useState, useEffect, useCallback } from "react";
import { get, set, del } from "idb-keyval";

const CLIENT_ID = "186862100308-4lfr928avpodulpf4d70m9jteh1qgm2r.apps.googleusercontent.com";
const SCOPE = "https://www.googleapis.com/auth/drive.file";
const FILE_NAME = "temple-backup.json";
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";
const DRIVE_USER_KEY = "temple-drive-user";

export function useGoogleDrive() {
  const [status, setStatus] = useState("idle");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [lastSync, setLastSync] = useState(null);
  const [tokenClient, setTokenClient] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Persist user info to idb-keyval
  const persistUser = useCallback(async (u) => {
    setUser(u);
    if (u) await set(DRIVE_USER_KEY, u);
    else await del(DRIVE_USER_KEY);
  }, []);

  // Fetch and store user info
  const fetchUser = useCallback(async (token) => {
    try {
      const r = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const info = await r.json();
      await persistUser({ name: info.name || "", email: info.email || "", picture: info.picture || "" });
    } catch {
      // Stay connected without name/email/picture
    }
  }, [persistUser]);

  // Load GIS + GAPI, then attempt silent reconnect if user was previously connected
  useEffect(() => {
    let gapiReady = false;
    let gisReady = false;

    const tryInit = async () => {
      if (!gapiReady || !gisReady) return;

      window.gapi.load("client", async () => {
        try {
          await window.gapi.client.init({ discoveryDocs: [DISCOVERY_DOC] });
        } catch (e) {
          console.error("GAPI init error", e);
        }
      });

      // Check if user was previously connected
      const savedUser = await get(DRIVE_USER_KEY);

      const onToken = async (tokenResponse, silent = false) => {
        if (tokenResponse.error) {
          if (silent) {
            // Silent reconnect failed — clear saved state, require manual sign-in
            await del(DRIVE_USER_KEY);
            setStatus("idle");
          } else {
            setStatus("error");
            setMessage("Sign-in failed. Please try again.");
          }
          return;
        }
        setAccessToken(tokenResponse.access_token);
        if (savedUser && silent) {
          // Restore user from storage immediately — no flicker
          setUser(savedUser);
        } else {
          setUser({ name: "", email: "", picture: "" });
          await fetchUser(tokenResponse.access_token);
        }
        setStatus("ready");
        setMessage("");
      };

      const tc = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPE,
        callback: (tokenResponse) => onToken(tokenResponse, false),
      });
      setTokenClient(tc);

      // Attempt silent reconnect if user was previously connected
      if (savedUser) {
        setUser(savedUser);
        setStatus("signing-in");
        // Silent token request — no popup, no consent screen
        const silentClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPE,
          prompt: "",
          callback: (tokenResponse) => onToken(tokenResponse, true),
        });
        silentClient.requestAccessToken({ prompt: "" });
      }
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
  }, [fetchUser, persistUser]);

  const signIn = useCallback(() => {
    if (!tokenClient) {
      setMessage("Google Sign-In is still loading. Please wait a moment.");
      return;
    }
    setStatus("signing-in");
    setMessage("");
    tokenClient.requestAccessToken({ prompt: "consent" });
  }, [tokenClient]);

  const signOut = useCallback(async () => {
    if (accessToken) {
      window.google?.accounts.oauth2.revoke(accessToken, () => {});
    }
    setAccessToken(null);
    await persistUser(null);
    setStatus("idle");
    setMessage("");
    setLastSync(null);
  }, [accessToken, persistUser]);

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
      form.append("metadata", new Blob([JSON.stringify({ name: FILE_NAME, mimeType: "application/json" })], { type: "application/json" }));
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
