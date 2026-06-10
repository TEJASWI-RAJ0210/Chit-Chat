import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signin } from "../API.js";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData]       = useState({ email: "", password: "" });
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await signin(formData);
      if (res.status === 200) {
        localStorage.setItem("token",    res.data.token);
        localStorage.setItem("userId",   res.data.user._id);
        localStorage.setItem("username", res.data.user.username || "");
        // Redirect based on whether username is set
        navigate(res.data.user.username ? "/chat" : "/UserName");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap');
        .cc-input {
          width: 100%;
          background: #f7f8fc;
          border: 1.5px solid #e8eaf0;
          border-radius: 12px;
          padding: 11px 14px;
          font-size: 14px;
          color: #1a1d27;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          font-family: 'DM Sans', sans-serif;
        }
        .cc-input::placeholder { color: #b0b5c3; }
        .cc-input:focus {
          border-color: #00e5a0;
          box-shadow: 0 0 0 3px rgba(0,229,160,.12);
          background: #fff;
        }
        .cc-btn {
          width: 100%;
          background: #0f1117;
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 12px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Syne', sans-serif;
          letter-spacing: .03em;
          cursor: pointer;
          transition: background .2s, transform .1s;
        }
        .cc-btn:hover:not(:disabled) { background: #1e2333; }
        .cc-btn:active:not(:disabled) { transform: scale(.98); }
        .cc-btn:disabled { opacity: .55; cursor: not-allowed; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        fontFamily: "'DM Sans', sans-serif",
        background: '#f7f8fc',
      }}>

        {/* ── Left panel — branding ── */}
        <div style={{
          width: '42%',
          background: '#0f1117',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 52px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative glow */}
          <div style={{
            position: 'absolute', bottom: '-80px', left: '-80px',
            width: '360px', height: '360px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,229,160,.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: '80px', right: '-60px',
            width: '220px', height: '220px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,229,160,.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #00e5a0, #00b87a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: '13px', color: '#0f1117',
              boxShadow: '0 0 20px rgba(0,229,160,.35)',
            }}>CC</div>
            <span style={{ color: '#fff', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '16px', letterSpacing: '.04em' }}>
              ChitChat
            </span>
          </div>

          {/* Hero copy */}
          <div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: '42px', lineHeight: 1.1, color: '#fff',
              marginBottom: '16px',
            }}>
              Welcome<br />
              <span style={{ color: '#00e5a0' }}>back.</span>
            </h1>
            <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: 1.6, maxWidth: '280px' }}>
              Pick up where you left off. Your conversations are waiting.
            </p>
          </div>

          {/* Bottom tagline */}
          <p style={{ color: '#374151', fontSize: '12px' }}>
            © 2025 ChitChat · All rights reserved
          </p>
        </div>

        {/* ── Right panel — form ── */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 40px',
        }}>
          <div style={{ width: '100%', maxWidth: '380px' }}>

            {/* Heading */}
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 700,
              fontSize: '26px', color: '#0f1117', marginBottom: '6px',
            }}>
              Sign in
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/')}
                style={{ color: '#00b87a', background: 'none', border: 'none',
                         cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                         fontFamily: "'DM Sans', sans-serif", padding: 0 }}
              >
                Sign up
              </button>
            </p>

            {/* Error */}
            {error && (
              <div style={{
                background: '#fff1f1', border: '1.5px solid #fecaca',
                borderRadius: '10px', padding: '10px 14px',
                fontSize: '13px', color: '#dc2626', marginBottom: '20px',
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500,
                                color: '#4b5563', marginBottom: '6px' }}>
                  Email address
                </label>
                <input
                  className="cc-input"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#4b5563' }}>
                    Password
                  </label>
                  <a href="#" style={{ fontSize: '12px', color: '#00b87a', textDecoration: 'none', fontWeight: 500 }}>
                    Forgot password?
                  </a>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    className="cc-input"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    style={{ paddingRight: '42px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    style={{
                      position: 'absolute', right: '13px', top: '50%',
                      transform: 'translateY(-50%)', background: 'none',
                      border: 'none', cursor: 'pointer', color: '#9ca3af',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px',
                              fontSize: '13px', color: '#6b7280', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked
                  style={{ accentColor: '#00e5a0', width: '14px', height: '14px' }} />
                Remember me
              </label>

              {/* Submit */}
              <button className="cc-btn" type="submit" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#e8eaf0' }} />
              <span style={{ fontSize: '12px', color: '#b0b5c3', whiteSpace: 'nowrap' }}>
                or continue with
              </span>
              <div style={{ flex: 1, height: '1px', background: '#e8eaf0' }} />
            </div>

            {/* Google only */}
            <button style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', padding: '11px', borderRadius: '12px',
              border: '1.5px solid #e8eaf0', background: '#fff',
              fontSize: '14px', fontWeight: 500, color: '#374151',
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              transition: 'border-color .2s, box-shadow .2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00e5a0'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,229,160,.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e8eaf0'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <FcGoogle size={18} />
              Continue with Google
            </button>

          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;