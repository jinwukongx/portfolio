// src/components/sections/Contact.tsx
"use client";
import { FormEvent, useState } from "react";
import { RevealWrapper } from "@/components/ui/RevealWrapper";
import { GlitchText } from "@/components/ui/GlitchText";
import styles from "./Contact.module.css";

const LINKS = [
  {
    icon: "✉",
    label: "amakorchiemela@gmail.com",
    href: "mailto:amakorchiemela@gmail.com",
  },
  { icon: "📱", label: "+234 (702) 573-8353", href: "tel:+2347025738353" },
  {
    icon: "🔗",
    label: "LinkedIn",
    href: "https://linkedin.com/in/divine-amakor",
  },
  { icon: "⌥", label: "GitHub", href: "https://github.com/jinwukongx" },
];

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/mwvajypd", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className={styles.section}>
      <RevealWrapper delay={0}>
        <div className={styles.tag}>&gt; 06 // CONTACT.SH</div>
      </RevealWrapper>
      <RevealWrapper delay={60}>
        <GlitchText>GET IN TOUCH</GlitchText>
      </RevealWrapper>
      <RevealWrapper delay={120}>
        <div className={styles.grid}>
          <div>
            <p className={styles.copy}>
              Open to <strong>full-time roles</strong>,{" "}
              <strong>freelance projects</strong>, and interesting
              conversations.
              <br />
              <br />
              Drop a message — response time: <strong>&lt; 24hrs</strong>.
            </p>
            <div className={styles.links}>
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-hover
                >
                  <span className={styles.linkIcon}>{l.icon}</span>
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              name="name"
              className={styles.field}
              type="text"
              placeholder="> NAME_"
              required
            />
            <input
              name="email"
              className={styles.field}
              type="email"
              placeholder="> EMAIL_"
              required
            />
            <textarea
              name="message"
              className={styles.field}
              placeholder="> MESSAGE_"
              rows={5}
              required
            />
            <button
              type="submit"
              className={styles.submit}
              data-cursor-hover
              disabled={status === "sending" || status === "sent"}
            >
              {status === "idle" && "TRANSMIT MESSAGE →"}
              {status === "sending" && "TRANSMITTING..."}
              {status === "sent" && "MESSAGE SENT ✓"}
              {status === "error" && "ERROR — RETRY"}
            </button>
          </form>
        </div>
      </RevealWrapper>
    </section>
  );
}
