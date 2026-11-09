"use client";

import { useEffect, useState, useRef } from "react";

export default function StartupAnimation() {
  const [active, setActive] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      // Check if intro animation has already been shown in this browser session
      const alreadyShown = sessionStorage.getItem("icetite28_intro_seen");

      if (!alreadyShown) {
        // First page opening in this session: trigger animation!
        sessionStorage.setItem("icetite28_intro_seen", "1");
        setActive(true);
      }
    } catch {
      // If sessionStorage is unavailable or blocked, don't show
      setActive(false);
    }

    // Expose a global replay trigger for manual testing (window.restartIntro())
    const replay = () => {
      try {
        sessionStorage.removeItem("icetite28_intro_seen");
      } catch {}
      setActive(false);
      setTimeout(() => setActive(true), 50);
    };

    (window as unknown as { restartIntro?: () => void }).restartIntro = replay;
    window.addEventListener("replay-startup-animation", replay);

    return () => {
      window.removeEventListener("replay-startup-animation", replay);
    };
  }, []);

  // Lock scroll and dismiss overlay after animation completes (~3.75s)
  useEffect(() => {
    if (!active) return;

    document.documentElement.classList.add("show-intro");
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      document.documentElement.classList.remove("show-intro");
      document.body.style.overflow = "";
      setActive(false);
    }, 3800);

    return () => {
      clearTimeout(timer);
      document.documentElement.classList.remove("show-intro");
      document.body.style.overflow = "";
    };
  }, [active]);

  if (!active) {
    return null;
  }

  return (
    <div
      id="intro-overlay"
      className="active"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#f7f7f7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        animation: "introExit 0.9s cubic-bezier(0.77, 0, 0.18, 1) 2.85s forwards",
      }}
      aria-label="ic-ETITE'28 Startup Animation"
    >
      <div className="sa-stage-wrapper">
        <div className="sa-stage">
          <div className="sa-frame" />
          <div className="sa-dot sa-one" />
          <div className="sa-dot sa-two" />

          <div className="sa-logo-wrap">
            <div className="sa-logo" aria-label="ic-ETITE 28">
              <span className="sa-ic">ic</span>
              <span className="sa-dash">-</span>
              <span className="sa-e">E</span>
              <span className="sa-t">T</span>
              <span className="sa-i">I</span>
              <span className="sa-t">T</span>
              <span className="sa-e">E</span>
              <span className="sa-apostrophe">&apos;</span>
              <span className="sa-year">28</span>
            </div>

            <div className="sa-subtitle">SCORE VIT VELLORE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
