import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signup } from "../API.js";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData]         = useState({ fullName: "", email: "", password: "" });
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed]             = useState(false);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms of Service.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await signup(formData);
      if (res.status === 201) {
        localStorage.setItem("token",  res.data.token);
        localStorage.setItem("userId", res.data.userId);
        navigate("/UserName");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      const userRes = await fetch(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );

      const user = await userRes.json();

      

      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          name: user.name,
          email: user.email,
          picture: user.picture,
        }
      );

      console.log("Backend Response:", res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/chat");
    } catch (error) {
      console.error(
        "Google Login Error:",
        error.response?.data || error
      );
    }
  },

  onError: () => {
    console.log("Google Login Failed");
  },
});

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
          box-sizing: border-box;
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
          {/* Glow blobs */}
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '300px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,229,160,.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '60px', left: '-80px',
            width: '260px', height: '260px', borderRadius: '50%',
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
            <span style={{ color: '#fff', fontFamily: "'Syne', sans-serif",
                           fontWeight: 700, fontSize: '16px', letterSpacing: '.04em' }}>
              ChitChat
            </span>
          </div>

          {/* Hero copy */}
          <div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: '42px', lineHeight: 1.1, color: '#fff', marginBottom: '16px',
            }}>
              Start<br />
              <span style={{ color: '#00e5a0' }}>chatting.</span>
            </h1>
            <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: 1.6, maxWidth: '280px' }}>
              Join ChitChat and connect with friends in real-time. It only takes a moment.
            </p>

            {/* Feature pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '28px' }}>
              {[
                '💬  Real-time messaging',
                '🤖  AI-powered assistant',
                '🔒  Secure & private',
              ].map((f) => (
                <div key={f} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)',
                  borderRadius: '10px', padding: '8px 14px',
                  fontSize: '13px', color: '#d1d5db',
                }}>
                  {f}
                </div>
              ))}
            </div>
          </div>

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
          overflowY: 'auto',
        }}>
          <div style={{ width: '100%', maxWidth: '380px' }}>

            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 700,
              fontSize: '26px', color: '#0f1117', marginBottom: '6px',
            }}>
              Create account
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>
              Already have an account?{' '}
              <button
                onClick={() => navigate('/')}
                style={{ color: '#00b87a', background: 'none', border: 'none',
                         cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                         fontFamily: "'DM Sans', sans-serif", padding: 0 }}
              >
                Sign in
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

              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500,
                                color: '#4b5563', marginBottom: '6px' }}>
                  Full name
                </label>
                <input
                  className="cc-input"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>

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
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500,
                                color: '#4b5563', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="cc-input"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    autoComplete="new-password"
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

              {/* Terms */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '9px',
                              fontSize: '13px', color: '#6b7280', cursor: 'pointer',
                              lineHeight: 1.5 }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{ accentColor: '#00e5a0', width: '14px', height: '14px',
                           marginTop: '2px', flexShrink: 0 }}
                />
                I agree to the{' '}
                <span style={{ color: '#00b87a', fontWeight: 500, cursor: 'pointer' }}>
                  Terms of Service
                </span>{' '}
                and{' '}
                <span style={{ color: '#00b87a', fontWeight: 500, cursor: 'pointer' }}>
                  Privacy Policy
                </span>
              </label>

              {/* Submit */}
              <button className="cc-btn" type="submit" disabled={loading}>
                {loading ? 'Creating account…' : 'Create account'}
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
            <button  onClick={() => googleLogin()} style={{
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

export default SignUp;