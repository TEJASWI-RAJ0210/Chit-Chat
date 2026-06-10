import React, { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiRefreshCw } from "react-icons/fi";
import api from "../API.js";

const ADJECTIVES = ["cool","fast","happy","smart","lucky","brave","witty","wild","quiet","bright","clever","calm"];
const ANIMALS    = ["lion","tiger","bear","wolf","fox","eagle","owl","shark","panda","koala","raven","lynx"];

const randomUsername = () => {
  const adj    = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num    = Math.floor(Math.random() * 999);
  return `${adj}_${animal}${num}`;
};

const UserName = () => {
  const navigate = useNavigate();
  const [username,  setUsername]  = useState("");
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [available, setAvailable] = useState(null); // null | true | false
  const [suggestions, setSuggestions] = useState(() => [randomUsername(), randomUsername(), randomUsername()]);
  const debounceTimer = useRef(null);

  /* ── Check availability ── */
  const checkAvailability = async (name) => {
    if (!name.trim() || name.length < 3) return;
    setLoading(true);
    try {
      const res = await api.post("/auth/check-username", { username: name });
      setAvailable(res.data.available);
      setError(res.data.available ? "" : "Username is already taken.");
    } catch {
      setAvailable(false);
      setError("Error checking username.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Input change with debounce ── */
  const handleChange = (e) => {
    // Only allow valid username chars
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, "");
    setUsername(value);
    setAvailable(null);
    setError("");
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    // 800ms debounce — was 5000ms which is way too slow
    debounceTimer.current = setTimeout(() => checkAvailability(value), 800);
  };

  /* ── Pick a suggestion ── */
  const pickSuggestion = async (name) => {
    setUsername(name);
    setAvailable(null);
    setError("");
    await checkAvailability(name);
  };

  /* ── Submit ── */
  const handleContinue = async () => {
    if (!available || !username.trim()) return;
    const userId = localStorage.getItem("userId");
    setLoading(true);
    try {
      await api.post("/auth/set-username", { userId, username });
      localStorage.setItem("username", username);
      navigate("/settings");
    } catch (err) {
      setError("Failed to set username. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Status indicator ── */
  const statusEl = () => {
    if (username.length > 0 && username.length < 3)
      return <span style={{ color: '#f59e0b' }}>Min. 3 characters</span>;
    if (loading)
      return <span style={{ color: '#9ca3af' }}>Checking availability…</span>;
    if (available === true)
      return <span style={{ color: '#00b87a' }}>✓ Username is available!</span>;
    if (available === false)
      return <span style={{ color: '#ef4444' }}>✗ {error}</span>;
    return null;
  };

  const canContinue = available === true && username.trim().length >= 3 && !loading;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap');
        .un-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 15px;
          color: #1a1d27;
          font-family: 'DM Sans', sans-serif;
          padding: 11px 14px 11px 0;
        }
        .un-input::placeholder { color: #b0b5c3; }
        .un-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          border-radius: 999px;
          border: 1.5px solid #e8eaf0;
          background: #fff;
          font-size: 13px; color: #4b5563;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: border-color .18s, box-shadow .18s, background .18s;
          white-space: nowrap;
        }
        .un-pill:hover {
          border-color: #00e5a0;
          box-shadow: 0 0 0 3px rgba(0,229,160,.1);
          background: #f0fdf8;
          color: #0f1117;
        }
        .un-pill:disabled { opacity: .5; cursor: not-allowed; }
      `}</style>

      <div style={{
        minHeight: '100vh', display: 'flex',
        fontFamily: "'DM Sans', sans-serif",
        background: '#f7f8fc',
      }}>

        {/* ── Left branding panel ── */}
        <div style={{
          width: '42%', background: '#0f1117',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 52px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Glow blobs */}
          <div style={{
            position: 'absolute', bottom: '-60px', right: '-60px',
            width: '320px', height: '320px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,229,160,.16) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: '120px', left: '-80px',
            width: '240px', height: '240px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,229,160,.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #00e5a0, #00b87a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '13px', color: '#0f1117',
              boxShadow: '0 0 20px rgba(0,229,160,.35)',
            }}>CC</div>
            <span style={{ color: '#fff', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '16px', letterSpacing: '.04em' }}>
              ChitChat
            </span>
          </div>

          {/* Copy */}
          <div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: '40px', lineHeight: 1.1, color: '#fff', marginBottom: '16px',
            }}>
              Pick your<br />
              <span style={{ color: '#00e5a0' }}>identity.</span>
            </h1>
            <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: 1.6, maxWidth: '280px' }}>
              Your username is how people find you on ChitChat. Make it memorable.
            </p>

            {/* Tips */}
            <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                '✦  3–20 characters',
                '✦  Letters, numbers, dots & underscores',
                '✦  Can be changed later in Settings',
              ].map((tip) => (
                <div key={tip} style={{
                  fontSize: '13px', color: '#4b5563',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          <p style={{ color: '#374151', fontSize: '12px' }}>
            © 2025 ChitChat · All rights reserved
          </p>
        </div>

        {/* ── Right form panel ── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '48px 40px',
        }}>
          <div style={{ width: '100%', maxWidth: '400px' }}>

            {/* Step badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#00e5a0/10', border: '1.5px solid #00e5a0',
              borderRadius: '999px', padding: '4px 12px',
              fontSize: '12px', fontWeight: 600, color: '#00b87a',
              marginBottom: '20px', backgroundColor: 'rgba(0,229,160,.08)',
            }}>
              Step 3 of 3
            </div>

            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 700,
              fontSize: '26px', color: '#0f1117', marginBottom: '6px',
            }}>
              Choose a username
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '28px' }}>
              This is your unique handle on ChitChat.
            </p>

            {/* Input */}
            <div style={{
              display: 'flex', alignItems: 'center',
              background: '#f7f8fc',
              border: `1.5px solid ${available === true ? '#00e5a0' : available === false ? '#fca5a5' : '#e8eaf0'}`,
              borderRadius: '12px', overflow: 'hidden',
              boxShadow: available === true
                ? '0 0 0 3px rgba(0,229,160,.12)'
                : available === false
                ? '0 0 0 3px rgba(252,165,165,.15)'
                : 'none',
              transition: 'border-color .2s, box-shadow .2s',
              marginBottom: '8px',
            }}>
              <span style={{
                padding: '0 0 0 16px', fontSize: '15px',
                color: '#9ca3af', fontWeight: 500, userSelect: 'none',
              }}>@</span>
              <input
                className="un-input"
                type="text"
                value={username}
                onChange={handleChange}
                placeholder="your_username"
                disabled={loading}
                maxLength={20}
              />
              {/* Character count */}
              <span style={{
                padding: '0 14px 0 0', fontSize: '11px',
                color: username.length > 16 ? '#f59e0b' : '#d1d5db',
              }}>
                {username.length}/20
              </span>
            </div>

            {/* Status */}
            <p style={{ fontSize: '12px', minHeight: '18px', marginBottom: '24px', fontWeight: 500 }}>
              {statusEl()}
            </p>

            {/* Suggestions */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: '12px',
              }}>
                <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>
                  Suggestions
                </span>
                <button
                  onClick={() => setSuggestions([randomUsername(), randomUsername(), randomUsername()])}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '12px', color: '#00b87a', fontWeight: 500,
                    fontFamily: "'DM Sans', sans-serif", padding: 0,
                  }}
                >
                  <FiRefreshCw size={11} />
                  Refresh
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {suggestions.map((name) => (
                  <button
                    key={name}
                    className="un-pill"
                    onClick={() => pickSuggestion(name)}
                    disabled={loading}
                  >
                    <span style={{ color: '#00b87a', fontWeight: 600 }}>@</span>
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              style={{
                width: '100%',
                background: canContinue ? '#0f1117' : '#e8eaf0',
                color: canContinue ? '#fff' : '#b0b5c3',
                border: 'none', borderRadius: '12px',
                padding: '13px', fontSize: '14px', fontWeight: 600,
                fontFamily: "'Syne', sans-serif", letterSpacing: '.03em',
                cursor: canContinue ? 'pointer' : 'not-allowed',
                transition: 'background .2s, transform .1s',
              }}
              onMouseEnter={(e) => { if (canContinue) e.currentTarget.style.background = '#1e2333'; }}
              onMouseLeave={(e) => { if (canContinue) e.currentTarget.style.background = '#0f1117'; }}
            >
              {loading ? 'Please wait…' : 'Continue →'}
            </button>

            {/* Skip note */}
            <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '12px', color: '#b0b5c3' }}>
              You can change your username anytime in Settings.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserName;