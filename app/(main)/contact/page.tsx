"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, MessageCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim()) return;

    setSending(true);
    // Simulate send — replace with actual API when backend is ready
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="px-4 pb-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
        </motion.div>
        <h2 className="text-xl font-bold mb-2">Message Sent!</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-[280px]">
          Thank you for reaching out. We'll get back to you within 24-48 hours.
        </p>
        <button
          onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
          className="px-6 py-2.5 rounded-full border border-border text-sm font-medium hover:bg-muted/30"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Contact Us</h1>
        <p className="text-sm text-muted-foreground">
          We'd love to hear from you
        </p>
      </div>

      {/* Quick options */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          href="mailto:support@soulsync.app"
          className="glass-card p-4 text-center hover:bg-muted/30 transition-colors"
        >
          <Mail className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium">Email</p>
          <p className="text-xs text-muted-foreground">support@soulsync.app</p>
        </motion.a>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card p-4 text-center"
        >
          <MessageCircle className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium">Live Chat</p>
          <p className="text-xs text-muted-foreground">Coming soon</p>
        </motion.div>
      </div>

      {/* Contact form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="glass-card p-4 space-y-4"
      >
        <h3 className="font-semibold">Send a Message</h3>

        <div>
          <label className="block text-xs text-muted-foreground mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="your@email.com"
            className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1">Subject</label>
          <select
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select a topic</option>
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="account">Account Issue</option>
            <option value="billing">Billing & Membership</option>
            <option value="content">Content Suggestion</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1">Message</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="How can we help you?"
            rows={4}
            className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={sending || !form.message.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {sending ? "Sending..." : "Send Message"}
        </button>
      </motion.form>
    </div>
  );
}
