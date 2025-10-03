"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import avatarImg from "./img/avatar.jpg";

export default function Home() {
  const linesRef = useRef<HTMLDivElement>(null);
  const hasRunRef = useRef(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const cryptoCanvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const boltTimerRef = useRef<number | null>(null);
  const shakeTimerRef = useRef<number | null>(null);
  const leftBoltPathRef = useRef<SVGPathElement>(null);
  const rightBoltPathRef = useRef<SVGPathElement>(null);
  const leftBoltSvgRef = useRef<SVGSVGElement>(null);
  const rightBoltSvgRef = useRef<SVGSVGElement>(null);
  const webCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const content: Array<{ type: string; text?: string }> = [
      { type: "meta", text: "# THƯ MỜI LỄ TỐT NGHIỆP" },
      { type: "invite", text: "Trân trọng kính mời Quý Thầy Cô, Anh Chị Em và Bạn Bè." },
      { type: "empty" },
      { type: "small", text: "Thời gian: Thứ Bảy, 04/10/2025 · 09:00 — 11:00" },
      { type: "small", text: "Địa điểm: Hội trường 300 — Trường Đại học Mỏ — Địa chất" },
      { type: "small", text: "Địa chỉ: Số 8, phố Viên, phường Đức Thắng, Bắc Từ Liêm, Hà Nội" },
      { type: "empty" },
      { type: "notice", text: "# system:" },
      { type: "cmd", text: "Ngụy Hồng Long đã quit server HUMG" },
      { type: "cmd", text: "$ sh bash congrats.sh" },
      { type: "empty" },
      { type: "invite", text: "Khi đến Hội trường 300, hãy gọi 0974758821 để mình đón tiếp chu đáo hơn." },
      { type: "closing", text: "Trân trọng." },
      { type: "empty" },
      { type: "end", text: "[Hẹn gặp Bạn tại HUMG]" },
    ];

    const el = linesRef.current;
    if (!el) return;
    const targetEl = el as HTMLDivElement;

    function renderLine(item: { type: string; text?: string }): string {
      switch (item.type) {
        case "meta":
          return '<div class="accent">' + (item.text ?? "") + "</div>";
        case "line":
          return "<div>" + (item.text ?? "") + "</div>";
        case "small":
          return '<div style="color:var(--muted)">' + (item.text ?? "") + "</div>";
        case "cmd":
          return '<div class="command">$ ' + (item.text ?? "") + "</div>";
        case "notice":
          return '<div style="color:#9bdcff">' + (item.text ?? "") + "</div>";
        case "invite":
          return '<div style="color:#fff;font-weight:700">' + (item.text ?? "") + "</div>";
        case "poem":
          return '<div style="font-style:italic;color:#bfe6ff">' + (item.text ?? "") + "</div>";
        case "closing":
          return '<div style="color:var(--muted)">' + (item.text ?? "") + "</div>";
        case "end":
          return '<div style="color:rgba(200,200,200,0.25)">' + (item.text ?? "") + "</div>";
        case "empty":
          return "<div>&nbsp;</div>";
        default:
          return "<div>" + (item.text ?? "") + "</div>";
      }
    }

    function typeText(html: string): Promise<void> {
      return new Promise((resolve) => {
        const container = document.createElement("div");
        targetEl.appendChild(container);
        const plain = html.replace(/<[^>]+>/g, "");
        let i = 0;
        const speed = 6 + Math.floor(Math.random() * 20);
        const timer = setInterval(() => {
          i++;
          container.innerText = plain.slice(0, i);
          targetEl.scrollTop = targetEl.scrollHeight;
          if (i >= plain.length) {
            clearInterval(timer);
            container.outerHTML = html;
            setTimeout(resolve, 120);
          }
        }, speed);
      });
    }

    (async function typeAll() {
      for (const it of content) {
        await typeText(renderLine(it));
      }
      const blink = document.createElement("span");
      blink.className = "blink";
      targetEl.appendChild(blink);
      targetEl.scrollTop = targetEl.scrollHeight;
    })();
  }, []);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let dotX = 0;
    let dotY = 0;
    let raf = 0 as number;

    const setActive = (active: boolean) => {
      ring.style.setProperty("--scale", active ? "0.85" : "1");
      dot.style.setProperty("--dscale", active ? "1.6" : "1");
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const target = e.target as HTMLElement | null;
      const interactive = !!target?.closest(".btn, .call, .dot, a, button, .terminal, .mapCard, .rsvpCard");
      ring.setAttribute("data-variant", interactive ? "interactive" : "default");
    };

    const onDown = () => setActive(true);
    const onUp = () => setActive(false);

    const tick = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;

      ring.style.setProperty("--tx", `${ringX - 12}px`);
      ring.style.setProperty("--ty", `${ringY - 12}px`);
      dot.style.setProperty("--dtx", `${dotX - 3}px`);
      dot.style.setProperty("--dty", `${dotY - 3}px`);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  // Mobile scroll: lightning bolts + shake
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const isMobile = () => window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768;
    let ticking = false;

    function makeBoltPath(height: number, side: 'left' | 'right'): string {
      const width = 60; // svg viewBox width
      const segments = Math.max(10, Math.floor(height / 80));
      let x = 30;
      const amp = 18;
      let d = `M ${x} -20`;
      for (let i = 0; i <= segments; i++) {
        const y = (i / segments) * (height + 40);
        const jitter = (Math.random() * 2 - 1) * amp;
        x = Math.max(8, Math.min(52, x + jitter * (side === 'left' ? 1 : -1)));
        d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      return d;
    }

    function strike(pathEl: SVGPathElement | null, side: 'left' | 'right') {
      if (!pathEl) return;
      const h = window.innerHeight;
      const d = makeBoltPath(h, side);
      pathEl.setAttribute('d', d);
      const len = (pathEl as any).getTotalLength?.() || 800;
      pathEl.style.transition = 'none';
      pathEl.style.strokeDasharray = String(len);
      pathEl.style.strokeDashoffset = String(len);
      // force reflow
      void pathEl.getBoundingClientRect();
      pathEl.style.transition = 'stroke-dashoffset .22s ease-out, opacity .22s ease-out';
      pathEl.style.strokeDashoffset = '0';
      pathEl.style.opacity = '1';
    }

    function strikeBranches(svgEl: SVGSVGElement | null, side: 'left' | 'right') {
      if (!svgEl) return;
      const h = window.innerHeight;
      const paths = svgEl.querySelectorAll<SVGPathElement>('path.boltBranch');
      paths.forEach((p) => {
        const count = 4 + Math.floor(Math.random() * 3);
        let x = side === 'left' ? 34 : 26;
        const amp = 22;
        let d = '';
        let startY = Math.random() * (h * 0.6);
        d += `M ${x} ${startY.toFixed(1)}`;
        for (let i = 0; i < count; i++) {
          startY += 40 + Math.random() * 60;
          const jitter = (Math.random() * 2 - 1) * amp;
          x = Math.max(6, Math.min(54, x + jitter * (side === 'left' ? 1 : -1)));
          d += ` L ${x.toFixed(1)} ${startY.toFixed(1)}`;
        }
        p.setAttribute('d', d);
        const len = (p as any).getTotalLength?.() || 300;
        p.style.transition = 'none';
        p.style.strokeDasharray = String(len);
        p.style.strokeDashoffset = String(len);
        void p.getBoundingClientRect();
        p.style.transition = 'stroke-dashoffset .18s ease-out, opacity .18s ease-out';
        p.style.strokeDashoffset = '0';
        p.style.opacity = String(0.8);
      });
    }

    const onScroll = () => {
      if (!isMobile()) return;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        wrap.classList.add('bolts-on');
        wrap.classList.add('shake');
        strike(leftBoltPathRef.current, 'left');
        strike(rightBoltPathRef.current, 'right');
        strikeBranches(leftBoltSvgRef.current, 'left');
        strikeBranches(rightBoltSvgRef.current, 'right');
        if (boltTimerRef.current) window.clearTimeout(boltTimerRef.current);
        if (shakeTimerRef.current) window.clearTimeout(shakeTimerRef.current);
        boltTimerRef.current = window.setTimeout(() => {
          wrap.classList.remove('bolts-on');
        }, 400);
        shakeTimerRef.current = window.setTimeout(() => {
          wrap.classList.remove('shake');
        }, 280);
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll as any);
      if (boltTimerRef.current) window.clearTimeout(boltTimerRef.current);
      if (shakeTimerRef.current) window.clearTimeout(shakeTimerRef.current);
    };
  }, []);

  // Interactive spiderwebs on mobile
  useEffect(() => {
    const canvas = webCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = () => window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768;
    let raf = 0 as number;
    const webs: Array<{ cx: number; cy: number; spokes: Array<{ angle: number; len: number; base: number }>; life: number }> = [];

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    function spawnWeb(x: number, y: number) {
      const spokesCount = 8 + Math.floor(Math.random() * 4);
      const spokes = new Array(spokesCount).fill(0).map((_, i) => {
        const angle = (i / spokesCount) * Math.PI * 2 + Math.random() * 0.2;
        const base = 80 + Math.random() * 80;
        return { angle, len: base, base };
      });
      webs.push({ cx: x, cy: y, spokes, life: 1 });
      if (webs.length > 6) webs.shift();
    }

    let activeIndex: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      if (!isMobile()) return;
      const t = e.touches[0];
      const x = t.clientX, y = t.clientY;
      // pick nearest or create
      let idx = -1, best = 1e9;
      for (let i = 0; i < webs.length; i++) {
        const dx = webs[i].cx - x, dy = webs[i].cy - y;
        const d2 = dx * dx + dy * dy;
        if (d2 < best) { best = d2; idx = i; }
      }
      if (best > 160 * 160 || idx === -1) {
        spawnWeb(x, y);
        activeIndex = webs.length - 1;
      } else activeIndex = idx;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isMobile()) return;
      if (activeIndex == null) return;
      const t = e.touches[0];
      const web = webs[activeIndex];
      web.cx += (t.clientX - web.cx) * 0.25;
      web.cy += (t.clientY - web.cy) * 0.25;
    };
    const onTouchEnd = () => { activeIndex = null; };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';
      webs.forEach((w, wi) => {
        // animate spokes
        w.spokes.forEach((s, i) => {
          s.len += Math.sin((Date.now() * 0.002 + i * 0.7)) * 0.6;
        });
        // radial threads
        ctx.strokeStyle = 'rgba(200,230,255,0.6)';
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        w.spokes.forEach((s) => {
          const ex = w.cx + Math.cos(s.angle) * s.len;
          const ey = w.cy + Math.sin(s.angle) * s.len;
          ctx.moveTo(w.cx, w.cy);
          ctx.lineTo(ex, ey);
        });
        ctx.stroke();
        // circular threads
        ctx.strokeStyle = 'rgba(180,210,255,0.45)';
        for (let r = 0.35; r <= 1; r += 0.22) {
          ctx.beginPath();
          for (let i = 0; i < w.spokes.length; i++) {
            const a = w.spokes[i].angle;
            const len = w.spokes[i].len * r;
            const x = w.cx + Math.cos(a) * len;
            const y = w.cy + Math.sin(a) * len;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
        }
        // fade out slowly when not active
        w.life -= 0.003;
        if (w.life <= 0) { webs.splice(wi, 1); }
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    // spawn on scroll near edges
    const onScrollSpawn = () => {
      if (!isMobile()) return;
      const y = 40 + Math.random() * (window.innerHeight - 80);
      const side = Math.random() < 0.5 ? 16 : window.innerWidth - 16;
      spawnWeb(side, y);
      wrapRef.current?.classList.add('webs-on');
      window.setTimeout(() => wrapRef.current?.classList.remove('webs-on'), 1200);
    };
    window.addEventListener('scroll', onScrollSpawn, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('touchstart', onTouchStart as any);
      window.removeEventListener('touchmove', onTouchMove as any);
      window.removeEventListener('touchend', onTouchEnd as any);
      window.removeEventListener('scroll', onScrollSpawn as any);
    };
  }, []);

  useEffect(() => {
    const canvas = cryptoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0 as number;
    let fontSize = 16;
    const chars = "01ABCDEF<>[]{}#@$%&*+-".split("");
    let columns = 0;
    let drops: number[] = [];

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(0);
    };
    ctx.globalCompositeOperation = "lighter";
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255,140,160,1)";
      ctx.shadowColor = "rgba(255,150,170,0.7)";
      ctx.shadowBlur = 10;
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Roboto Mono, Courier New, monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0; else drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  

  const emailRef = useRef<HTMLInputElement>(null);
  const [sending, setSending] = React.useState(false);
  const [result, setResult] = React.useState<null | { ok: boolean; message: string }>(null);

  const submitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    const email = emailRef.current?.value?.trim() || "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setResult({ ok: false, message: "Vui lòng nhập email hợp lệ" });
      return;
    }
    try {
      setSending(true);
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setResult({ ok: !!data?.ok, message: data?.message || (res.ok ? "Đã gửi thư mời" : "Gửi thất bại") });
      if (res.ok && emailRef.current) emailRef.current.value = "";
    } catch (err) {
      setResult({ ok: false, message: "Có lỗi xảy ra, vui lòng thử lại" });
    } finally {
      setSending(false);
    }
  };

  // Voice greeting recorder states
  const nameWishRef = useRef<HTMLInputElement>(null);
  const emailWishRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = React.useState(false);
  const [audioBlob, setAudioBlob] = React.useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
  const [wishSending, setWishSending] = React.useState(false);
  const [wishResult, setWishResult] = React.useState<null | { ok: boolean; message: string }>(null);
  const [wishMode, setWishMode] = React.useState<"voice" | "text">("voice");
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [messageText, setMessageText] = React.useState("");

  const startRecording = async () => {
    try {
      setWishResult(null);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioBlob(null);
      setAudioUrl(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        chunksRef.current = [];
        const st = streamRef.current;
        if (st) {
          st.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
      };
      mr.start();
      setRecording(true);
    } catch (err) {
      setWishResult({ ok: false, message: "Không thể truy cập micro" });
      setRecording(false);
    }
  };

  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr && recording) {
      mr.stop();
      setRecording(false);
    }
  };

  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setWishResult(null);
  };

  const submitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    setWishResult(null);
    const name = nameWishRef.current?.value.trim() || "";
    const email = emailWishRef.current?.value.trim() || "";
    const message = messageText.trim();
    if (name.length < 2) {
      setWishResult({ ok: false, message: "Vui lòng nhập tên hợp lệ" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setWishResult({ ok: false, message: "Vui lòng nhập email hợp lệ" });
      return;
    }
    if (wishMode === "voice" && !audioBlob) {
      setWishResult({ ok: false, message: "Vui lòng ghi lời chúc trước khi gửi" });
      return;
    }
    if (wishMode === "text" && !message) {
      setWishResult({ ok: false, message: "Vui lòng nhập lời chúc" });
      return;
    }
    try {
      setWishSending(true);
      const fd = new FormData();
      fd.append("name", name);
      fd.append("email", email);
      if (wishMode === "voice" && audioBlob) {
        fd.append("audio", new File([audioBlob], "loi-chuc.webm", { type: audioBlob.type || "audio/webm" }));
      }
      if (wishMode === "text") {
        fd.append("message", message);
      }
      const res = await fetch("/api/greeting", { method: "POST", body: fd });
      const data = await res.json();
      setWishResult({ ok: !!data?.ok, message: data?.message || (res.ok ? "Đã gửi lời chúc" : "Gửi thất bại") });
      if (res.ok) {
        if (nameWishRef.current) nameWishRef.current.value = "";
        if (emailWishRef.current) emailWishRef.current.value = "";
        resetRecording();
        if (messageRef.current) messageRef.current.value = "";
        setMessageText("");
      }
    } catch (err) {
      setWishResult({ ok: false, message: "Có lỗi xảy ra, vui lòng thử lại" });
    } finally {
      setWishSending(false);
    }
  };

  return (
    <div className="wrap" ref={wrapRef}>
      <canvas ref={cryptoCanvasRef} className="crypto-bg" aria-hidden="true"></canvas>
      <canvas ref={webCanvasRef} className="web-bg" aria-hidden="true"></canvas>
      <svg ref={leftBoltSvgRef} className="boltSvg left" viewBox="0 0 60 1000" preserveAspectRatio="none" aria-hidden="true">
        <path ref={leftBoltPathRef} className="boltPath" />
        <path className="boltBranch" />
        <path className="boltBranch" />
        <path className="boltBranch" />
        <path className="boltBranch" />
      </svg>
      <svg ref={rightBoltSvgRef} className="boltSvg right" viewBox="0 0 60 1000" preserveAspectRatio="none" aria-hidden="true">
        <path ref={rightBoltPathRef} className="boltPath" />
        <path className="boltBranch" />
        <path className="boltBranch" />
        <path className="boltBranch" />
        <path className="boltBranch" />
      </svg>
      <div className="layout">
        <div className="leftCol">
          <aside className="avatarCard" aria-label="Ảnh đại diện">
            <div className="header" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="dots">
                  <div className="dot red"></div>
                  <div className="dot yellow"></div>
                  <div className="dot green"></div>
                </div>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>Giới thiệu</div>
              </div>
            </div>
            <div className="avatarBody">
              <div className="avatarBox">
                <Image src={avatarImg} alt="Avatar" fill sizes="160px" className="avatarImg" priority />
              </div>
              <div>
                <div className="avatarName">Ngụy Hồng Long</div>
                <div className="introText">Khoa học Máy tính · HUMG</div>
                <div className="introText">Tốt nghiệp: 04/10/2025</div>
              </div>
            </div>
          </aside>

        <div className="terminal" role="region" aria-label="Thư mời tốt nghiệp terminal">
          <div className="header">
            <div className="dots">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>
            <div style={{ marginLeft: 10, color: "var(--muted)", fontSize: 13 }}>Hệ thống: HUMG · Lễ tốt nghiệp</div>
          </div>

          <div className="screen" >
            <div className="controls" style={{ marginBottom: 10 }}>HackerVN2002@invite:~/graduation</div>
            <div className="inviteBox">
            <div id="lines" ref={linesRef} className="lines"></div>
            </div>
          </div>

          <div className="footer">
            <div></div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <a className="btn call" href="tel:0974758821" aria-label="Gọi ngay 0974758821">Gọi ngay: 0974758821</a>
            </div>
          </div>
          </div>
        </div>

        <div className="rightCol">
          <aside className="mapCard" aria-label="Bản đồ tới Trường Đại học Mỏ - Địa chất">
            <div className="header" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="dots">
                  <div className="dot red"></div>
                  <div className="dot yellow"></div>
                  <div className="dot green"></div>
                </div>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>Bản đồ: HUMG</div>
              </div>
              <a className="btn" href="https://www.google.com/maps?q=Tr%C6%B0%E1%BB%9Dng%20%C4%90%E1%BA%A1i%20h%E1%BB%8Dc%20M%E1%BB%8F%20-%20%C4%90%E1%BB%8Ba%20ch%E1%BA%A5t%2C%20S%E1%BB%91%208%20Ph%E1%BB%91%20Vi%C3%AAn%2C%20%C4%90%E1%BB%A9c%20Th%E1%BA%AFng%2C%20B%E1%BA%AFc%20T%E1%BB%AB%20Li%C3%AAm%2C%20H%C3%A0%20N%E1%BB%99i&output=classic" target="_blank" rel="noopener noreferrer">Mở bản đồ</a>
            </div>
            <div className="mapBody">
              <iframe
                className="gmap"
                title="Google Map - Trường Đại học Mỏ - Địa chất"
                src="https://www.google.com/maps?q=Tr%C6%B0%E1%BB%9Dng%20%C4%90%E1%BA%A1i%20h%E1%BB%8Dc%20M%E1%BB%8F%20-%20%C4%90%E1%BB%8Ba%20ch%E1%BA%A5t%2C%20S%E1%BB%91%208%20Ph%E1%BB%91%20Vi%C3%AAn%2C%20%C4%90%E1%BB%A9c%20Th%E1%BA%AFng%2C%20B%E1%BA%AFc%20T%E1%BB%AB%20Li%C3%AAm%2C%20H%C3%A0%20N%E1%BB%99i&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="footer">
              <div style={{ opacity: 0.9 }}>Số 8, phố Viên, Đức Thắng, Bắc Từ Liêm, Hà Nội</div>
              <a className="btn" href="https://www.google.com/maps?q=Tr%C6%B0%E1%BB%9Dng%20%C4%90%E1%BA%A1i%20h%E1%BB%8Dc%20M%E1%BB%8F%20-%20%C4%90%E1%BB%8Ba%20ch%E1%BA%A5t%2C%20S%E1%BB%91%208%20Ph%E1%BB%91%20Vi%C3%AAn%2C%20%C4%90%E1%BB%A9c%20Th%E1%BA%AFng%2C%20B%E1%BA%AFc%20T%E1%BB%AB%20Li%C3%AAm%2C%20H%C3%A0%20N%E1%BB%99i&output=classic" target="_blank" rel="noopener noreferrer">Chỉ đường</a>
            </div>
          </aside>

          <section className="rsvpCard" aria-label="Xác nhận tham gia (gửi email)">
            <div className="header" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="dots">
                  <div className="dot red"></div>
                  <div className="dot yellow"></div>
                  <div className="dot green"></div>
                </div>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>Xác nhận tham gia</div>
              </div>
            </div>
            <form className="rsvpForm" onSubmit={submitRsvp}>
              <label htmlFor="email" className="label">Nhập email để nhận thư mời</label>
              <div className="row">
                <input id="email" ref={emailRef} type="email" placeholder="you@example.com" className="input" aria-label="Email" required />
                <button className="btn submit" type="submit" disabled={sending}>
                  {sending ? "Đang gửi..." : "RSVP"}
                </button>
              </div>
              {result && (
                <div className={"noticeMsg " + (result.ok ? "ok" : "err")} role="status">{result.message}</div>
              )}
            </form>
          </section>

          <section className="rsvpCard" aria-label="Gửi lời chúc (ghi âm hoặc văn bản)">
            <div className="header" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="dots">
                  <div className="dot red"></div>
                  <div className="dot yellow"></div>
                  <div className="dot green"></div>
                </div>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>Gửi lời chúc bằng lời</div>
              </div>
            </div>
            <form className="rsvpForm" onSubmit={submitWish}>
              <div className="row" role="radiogroup" aria-label="Chọn cách gửi lời chúc">
                <label className="btn" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="radio" name="wish-mode" checked={wishMode === "voice"} onChange={() => setWishMode("voice")} /> Bằng giọng nói
                </label>
                <label className="btn" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="radio" name="wish-mode" checked={wishMode === "text"} onChange={() => setWishMode("text")} /> Bằng văn bản
                </label>
              </div>
              <label htmlFor="wish-name" className="label">Tên của bạn</label>
              <input id="wish-name" ref={nameWishRef} type="text" placeholder="Nguyễn Văn A" className="input" aria-label="Tên" required />

              <label htmlFor="wish-email" className="label">Email của bạn</label>
              <input id="wish-email" ref={emailWishRef} type="email" placeholder="you@example.com" className="input" aria-label="Email" required />

              {wishMode === "voice" ? (
                <div className="recorder">
                  <div className="hint" aria-live="polite">
                    <div className="steps">
                      <span className="step">1</span> Bắt đầu ghi <span className="sep">→</span>
                      <span className="step">2</span> Nói lời chúc <span className="sep">→</span>
                      <span className="step">3</span> Dừng ghi <span className="sep">→</span>
                      <span className="step">4</span> Gửi
                    </div>
                    <div className={"statusPill " + (recording ? "rec" : (audioBlob ? "ready" : "idle"))}>
                      {recording ? "Đang ghi..." : (audioBlob ? "Đã ghi xong" : "Chưa ghi âm")}
                    </div>
                  </div>
                  {!audioBlob && (
                    <div className="row">
                      {!recording ? (
                        <button type="button" className="micBtn" onClick={startRecording} aria-label="Bắt đầu ghi">
                          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                            <path fill="currentColor" d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3zm-7 9a1 1 0 012 0 5 5 0 0010 0 1 1 0 112 0 7 7 0 01-6 6.93V21h3a1 1 0 110 2H10a1 1 0 110-2h3v-3.07A7 7 0 015 11z"/>
                          </svg>
                        </button>
                      ) : (
                        <button type="button" className="micBtn recording" onClick={stopRecording} aria-label="Dừng ghi">
                          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                            <path fill="currentColor" d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3zm-7 9a1 1 0 012 0 5 5 0 0010 0 1 1 0 112 0 7 7 0 01-6 6.93V21h3a1 1 0 110 2H10a1 1 0 110-2h3v-3.07A7 7 0 015 11z"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  )}

                  {audioBlob && (
                    <div className="row" style={{ alignItems: "center", gap: 10 }}>
                      <audio controls className="audioPlayer" src={audioUrl || undefined} />
                      <button type="button" className="btn" onClick={resetRecording}>Ghi lại</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="recorder">
                  <label htmlFor="wish-message" className="label">Lời chúc của bạn</label>
                  <textarea
                    id="wish-message"
                    ref={messageRef}
                    placeholder="Gửi đến Long vài lời yêu thương..."
                    className="input textarea"
                    rows={6}
                    required
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                </div>
              )}

              <div className="row">
                <button className="btn submit" type="submit" disabled={
                  wishSending || (
                    wishMode === "text" ? messageText.trim().length === 0 : !audioBlob
                  )
                }>
                  {wishSending ? "Đang gửi..." : "Gửi lời chúc"}
                </button>
              </div>
              {wishResult && (
                <div className={"noticeMsg " + (wishResult.ok ? "ok" : "err")} role="status">{wishResult.message}</div>
              )}
            </form>
          </section>
        </div>
      </div>

      {/* custom cursor */}
      <div className="cursor-ring" ref={ringRef} aria-hidden="true"></div>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true"></div>

      <style jsx global>{`
        :root{--bg:#0b0c10;--panel:#0c1014;--accent:#ff3b3b;--muted:#98a2b3}
        html,body{height:100%;margin:0;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace;background:linear-gradient(180deg,#05070a 0%, #0b0e13 100%);color:#f4eaea;scroll-behavior:smooth;-webkit-overflow-scrolling:touch}
        .wrap{min-height:100%;display:flex;align-items:center;justify-content:center;padding:32px;cursor:none}
        .layout{display:grid;gap:18px;align-items:start;justify-content:center;width:100%;max-width:1200px;margin:0 auto;grid-template-columns:minmax(0,1fr) minmax(300px,520px);position:relative;z-index:2}
        .leftCol{display:flex;flex-direction:column;gap:18px;min-width:0}
        .rightCol{display:flex;flex-direction:column;gap:18px;width:100%;max-width:520px}
        .terminal{flex:1 1 680px;min-width:0;background:linear-gradient(180deg,var(--panel),#0b0e13);border-radius:12px;padding:20px 18px;box-shadow:0 20px 60px rgba(2,6,12,0.7);border:0;position:relative}
        .mapCard{width:100%;background:linear-gradient(180deg,var(--panel),#0b0e13);border-radius:12px;padding:20px 18px;box-shadow:0 20px 60px rgba(2,6,12,0.7);border:1px solid rgba(255,255,255,0.03);position:relative}
        .avatarCard{width:100%;background:linear-gradient(180deg,var(--panel),#0b0e13);border-radius:12px;padding:20px 18px;box-shadow:0 20px 60px rgba(2,6,12,0.7);border:1px solid rgba(255,255,255,0.03);position:relative}
        .rsvpCard{width:100%;background:linear-gradient(180deg,var(--panel),#0b0e13);border-radius:12px;padding:20px 18px;box-shadow:0 20px 60px rgba(2,6,12,0.7);border:1px solid rgba(255,255,255,0.03);position:relative}
        .header{display:flex;gap:10px;align-items:center;margin-bottom:12px}
        .dots{display:flex;gap:6px}
        .dot{width:12px;height:12px;border-radius:50%}
        .dot.red{background:#ff605c}
        .dot.yellow{background:#ffbd2e}
        .dot.green{background:#28ca41}
        .screen{background:rgba(3,10,20,0.6);border-radius:8px;padding:18px;min-height:340px;position:relative;overflow:hidden}
        .inviteBox{display:inline-block;max-width:100%;padding:14px 16px;border:1px solid rgba(255,255,255,0.08);border-radius:10px;background:rgba(0,0,0,0.15);box-shadow:0 8px 24px rgba(0,0,0,0.35)}
        .inviteBox .lines{max-width:100%;overflow-wrap:anywhere}
        .mapBody{background:rgba(3,10,20,0.6);border-radius:8px;height:clamp(260px, 42vw, 420px);position:relative;overflow:hidden}
        .gmap{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}
        .crypto-bg{position:fixed;inset:0;pointer-events:none;opacity:.28;z-index:0}
        .web-bg{position:fixed;inset:0;pointer-events:none;z-index:10001;opacity:.55;mix-blend-mode:screen}
        .boltSvg{position:fixed;top:0;left:0;height:100vh;width:60px;pointer-events:none;opacity:0;z-index:10002;mix-blend-mode:screen}
        .boltSvg.right{left:auto;right:0}
        .boltPath{fill:none;stroke:#fff;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 14px rgba(255,255,255,0.95))}
        .boltBranch{fill:none;stroke:#cfe7ff;stroke-width:1.4;opacity:.0;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 8px rgba(200,230,255,0.9))}
        .wrap.bolts-on .boltSvg{opacity:1}
        .wrap.shake{animation:shakeY .32s cubic-bezier(.36,.07,.19,.97) both}
        @keyframes shakeY{10%,90%{transform:translate3d(-3px,0,0) rotate(-0.25deg)}20%,80%{transform:translate3d(3px,0,0) rotate(0.25deg)}30%,50%,70%{transform:translate3d(-6px,0,0) rotate(-0.35deg)}40%,60%{transform:translate3d(6px,0,0) rotate(0.35deg)}}
        .avatarBody{display:flex;gap:14px;align-items:center}
        .avatarBox{position:relative;width:64px;height:64px;border-radius:999px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);box-shadow:0 8px 22px rgba(0,0,0,0.35)}
        .avatarImg{object-fit:cover}
        .avatarName{font-weight:700;color:#fff}
        .introText{font-size:13px;color:rgba(255,255,255,0.75)}
        .lines{white-space:pre-wrap;font-size:15px;line-height:1.5;color:var(--muted)}
        .accent{color:var(--accent)}
        .command{color:#ffffff}
        .blink{display:inline-block;width:10px;background:var(--accent);margin-left:6px;animation:blink 1s steps(2,end) infinite}
        @keyframes blink{50%{opacity:0}}
        .controls{position:static;display:inline-block;margin:6px 0 14px 0;padding:2px 8px;border-radius:6px;background:rgba(255,255,255,0.05);font-size:12px;color:rgba(255,255,255,0.75)}
        .footer{display:flex;justify-content:space-between;align-items:center;margin-top:14px;color:rgba(255,255,255,0.12);font-size:13px}
        .btn{background:transparent;border:1px solid rgba(255,255,255,0.08);padding:8px 12px;border-radius:8px;color:#ffeef0;font-weight:600;text-decoration:none;position:relative}
        .call{background:linear-gradient(90deg,#b31217,#5a0f0f);border:0;color:#fff;padding:8px 14px;border-radius:8px;font-weight:700;position:relative}

        /* hover effects */
        .terminal,.mapCard,.rsvpCard{will-change:transform,box-shadow;border-color:rgba(255,255,255,0.03);transition:box-shadow .35s ease,border-color .35s ease,transform .25s ease}
        .terminal:hover,.mapCard:hover,.rsvpCard:hover{box-shadow:0 26px 80px rgba(2,6,12,0.9);border-color:rgba(255,255,255,0.08);transform:translateY(-2px)}
        
        .rsvpForm{display:flex;flex-direction:column;gap:10px}
        .label{font-size:13px;color:rgba(255,255,255,0.6)}
        .row{display:flex;gap:10px}
        .input{flex:1;min-width:0;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);color:#e9f6ff;border-radius:8px;padding:10px 12px;outline:none;transition:border-color .2s ease, box-shadow .2s ease}
        .input::placeholder{color:rgba(255,255,255,0.35)}
        .input:hover{border-color:rgba(255,255,255,0.12)}
        .input:focus{border-color:#ff4d6d;box-shadow:0 0 0 3px rgba(255,77,109,0.18)}
        .submit{background:linear-gradient(90deg,#ff4d4f,#d9363e);border:0;color:#fff;padding:10px 14px;border-radius:8px;font-weight:700;min-width:130px}
        .submit:hover{background:linear-gradient(90deg,#ff6b6f,#ff4048)}
        .submit:disabled{opacity:.6;cursor:not-allowed}
        .noticeMsg{font-size:13px;margin-top:2px}
        .noticeMsg.ok{color:#39ffb3}
        .noticeMsg.err{color:#ff8888}

        .recorder{display:flex;flex-direction:column;gap:10px}
        .audioPlayer{width:100%}
        .micBtn{width:48px;height:48px;border-radius:999px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.06);display:inline-flex;align-items:center;justify-content:center;color:#cfefff;box-shadow:0 6px 16px rgba(0,0,0,0.25);transition:transform .15s ease, box-shadow .25s ease, background .25s ease, border-color .25s ease}
        .micBtn:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(0,0,0,0.32);border-color:rgba(255,255,255,0.2)}
        .micBtn:active{transform:translateY(0) scale(0.98)}
        .micBtn.recording{background:linear-gradient(90deg,#f44,#c22);border-color:rgba(255,96,92,0.6);color:#001;box-shadow:0 0 0 0 rgba(255,96,92,0.45);animation:pulse 1.2s ease-in-out infinite}
        @keyframes pulse{0%{box-shadow:0 0 0 0 rgba(255,96,92,0.45)}70%{box-shadow:0 0 0 14px rgba(255,96,92,0)}100%{box-shadow:0 0 0 0 rgba(255,96,92,0)}}
        .hint{display:flex;gap:10px;align-items:center;flex-wrap:wrap;color:rgba(255,255,255,0.65);font-size:13px}
        .steps .step{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:999px;background:rgba(255,77,109,0.18);color:#ff6b6f;font-weight:700;font-size:12px;margin-right:6px}
        .steps .sep{opacity:.55;margin:0 6px}
        .statusPill{padding:4px 8px;border-radius:999px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12)}
        .statusPill.idle{color:rgba(255,255,255,0.75)}
        .statusPill.rec{background:rgba(255,96,92,0.12);border-color:rgba(255,96,92,0.35);color:#ff9a9a}
        .statusPill.ready{background:rgba(255,77,109,0.12);border-color:rgba(255,77,109,0.35);color:#ffd6d9}

        .btn,.call{cursor:pointer;transition:background .25s ease,border-color .25s ease,transform .2s ease,box-shadow .25s ease,color .25s ease}
        .btn:hover{border-color:rgba(255,255,255,0.22);background:rgba(255,255,255,0.06);transform:translateY(-1px);box-shadow:0 6px 16px rgba(0,0,0,0.25)}
        .btn:active{transform:translateY(0) scale(0.98)}
        .call:hover{background:linear-gradient(90deg,#d61a22,#7a1010);box-shadow:0 8px 20px rgba(255,64,80,0.3);transform:translateY(-1px)}
        .call:active{transform:translateY(0) scale(0.99)}

        .dots .dot{transition:transform .2s ease,box-shadow .35s ease}
        .dots .dot:hover{transform:scale(1.08)}
        .dots .dot.red:hover{box-shadow:0 0 14px rgba(255,96,92,0.75)}
        .dots .dot.yellow:hover{box-shadow:0 0 14px rgba(255,189,46,0.75)}
        .dots .dot.green:hover{box-shadow:0 0 14px rgba(40,202,65,0.7)}
        
        /* tech cursor */
        .cursor-ring,.cursor-dot{position:fixed;left:0;top:0;pointer-events:none;z-index:9999}
        .cursor-ring{width:24px;height:24px;border-radius:999px;border:2px solid rgba(255,80,95,0.65);box-shadow:0 0 22px rgba(255,60,80,0.25);mix-blend-mode:difference;transition:border-color .2s ease, box-shadow .25s ease, opacity .25s ease}
        .cursor-dot{width:6px;height:6px;border-radius:999px;background:var(--accent);mix-blend-mode:difference}
        .cursor-ring{--tx:0px;--ty:0px;--scale:1;transform:translate3d(var(--tx),var(--ty),0) scale(var(--scale));will-change:transform}
        .cursor-dot{--dtx:0px;--dty:0px;--dscale:1;transform:translate3d(var(--dtx),var(--dty),0) scale(var(--dscale));will-change:transform}
        .cursor-ring[data-variant="interactive"]{opacity:0}
        /* smooth hover outline: keep pseudo-element present, animate opacity/scale */
        .terminal::after,
        .mapCard::after,
        .rsvpCard::after,
        .btn::after,
        .call::after{
          content:"";position:absolute;inset:-6px;border:2px solid rgba(255,77,109,0.0);border-radius:inherit;pointer-events:none;box-shadow:0 0 0 rgba(255,77,109,0.0);opacity:0;transform:scale(0.985);
          transition: opacity .22s cubic-bezier(.2,.8,.2,1), transform .22s cubic-bezier(.2,.8,.2,1), box-shadow .3s ease, border-color .3s ease;
        }
        .terminal:hover::after,
        .mapCard:hover::after,
        .rsvpCard:hover::after,
        .btn:hover::after,
        .call:hover::after{
          border-color:rgba(255,77,109,0.9);box-shadow:0 0 24px rgba(255,77,109,0.32);
          opacity:1;transform:scale(1);
        }
        @media (pointer: coarse){.cursor-ring,.cursor-dot{display:none}.wrap{cursor:auto}}
        @media (max-width:1024px){.layout{grid-template-columns:1fr}.rightCol{max-width:unset;width:100%}}
        @media (max-width:420px){.terminal{padding:14px}.screen{padding:12px}.mapCard{padding:14px}.rsvpCard{padding:14px}}
      `}</style>
    </div>
  );
}
