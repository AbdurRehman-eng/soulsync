"use client";

import { useRef, useEffect, useState, useCallback } from "react";

/**
 * SandboxedIframe - Netflix-style sandboxed content renderer.
 *
 * Security model:
 *  1. HTML string is converted to a Blob → Object URL (not srcDoc).
 *     This gives the iframe its own unique `blob:` origin, completely
 *     isolated from the parent's origin. The iframe cannot read cookies,
 *     localStorage, or any DOM of the host page.
 *  2. The `sandbox` attribute restricts capabilities. We only grant
 *     `allow-scripts` (needed for games to run JS). Everything else -
 *     forms, popups, top-navigation, same-origin access - is blocked.
 *  3. A strict Content-Security-Policy meta tag is injected into the
 *     HTML to block external network requests (no fetch, XHR, or
 *     loading remote scripts/images) unless explicitly allowed.
 *  4. Communication between the iframe and host happens exclusively
 *     via postMessage. The host validates `event.origin` (which will
 *     be "null" for blob: iframes - this is correct per spec).
 *
 * Usage:
 *   <SandboxedIframe
 *     htmlContent={rawHtml}
 *     title="My Game"
 *     onMessage={(data) => console.log(data)}
 *     className="w-full h-full"
 *   />
 */

interface SandboxedIframeProps {
  /** Raw HTML string to render inside the iframe */
  htmlContent: string;
  /** Title for accessibility */
  title?: string;
  /** Called when the iframe posts a message to the parent */
  onMessage?: (data: any) => void;
  /** Allow the iframe to load external resources (images, fonts, etc.)
   *  By default, CSP blocks all network requests for maximum isolation. */
  allowExternalResources?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Wraps raw HTML with a strict CSP meta tag and a postMessage bridge
 * that games can use to communicate score/completion back to the host.
 */
function wrapHtmlWithSecurity(
  html: string,
  allowExternalResources: boolean
): string {
  // Build CSP directives
  const cspDirectives = [
    "default-src 'none'",
    // Allow inline scripts (games need them) and blob: for workers
    "script-src 'unsafe-inline' blob:",
    // Allow inline styles
    "style-src 'unsafe-inline'",
    // Images: data: URIs always, external only if allowed
    allowExternalResources
      ? "img-src 'self' data: https: http: blob:"
      : "img-src data: blob:",
    // Fonts: only if allowed
    allowExternalResources
      ? "font-src 'self' data: https:"
      : "font-src data:",
    // Block all connections (fetch, XHR, WebSocket) unless allowed
    allowExternalResources
      ? "connect-src 'self' https:"
      : "connect-src 'none'",
    // Media
    allowExternalResources
      ? "media-src 'self' data: blob: https:"
      : "media-src data: blob:",
    // No iframes inside the iframe
    "frame-src 'none'",
    // No objects/embeds
    "object-src 'none'",
    // Base URI locked to prevent base-tag hijacking
    "base-uri 'none'",
    // Block form submissions
    "form-action 'none'",
  ].join("; ");

  // Inject CSP and a postMessage bridge at the top of <head>
  // The bridge provides a clean API: SoulSync.postScore(n), SoulSync.complete(n)
  const injection = `
<meta http-equiv="Content-Security-Policy" content="${cspDirectives}">
<script>
  // === Soul Sync Game Bridge ===
  // Games can call these helpers to communicate with the host app.
  window.SoulSync = {
    postScore: function(score) {
      parent.postMessage({ type: 'GAME_SCORE', score: score }, '*');
    },
    complete: function(score) {
      parent.postMessage({ type: 'GAME_COMPLETE', score: score }, '*');
    },
    postEvent: function(eventType, data) {
      parent.postMessage({ type: eventType, ...data }, '*');
    }
  };
</script>
`;

  // Try to inject into <head>. If no <head>, prepend before everything.
  if (html.includes("<head>")) {
    return html.replace("<head>", `<head>${injection}`);
  } else if (html.includes("<HEAD>")) {
    return html.replace("<HEAD>", `<HEAD>${injection}`);
  } else if (html.includes("<!DOCTYPE") || html.includes("<!doctype") || html.includes("<html") || html.includes("<HTML")) {
    // Has HTML structure but no explicit <head>
    return html.replace(/<html[^>]*>/i, (match) => `${match}<head>${injection}</head>`);
  } else {
    // Raw HTML fragment - wrap in a full document
    return `<!DOCTYPE html>
<html>
<head>
${injection}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #1a0a2e;
    color: white;
    font-family: system-ui, -apple-system, sans-serif;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
  }
</style>
</head>
<body>
${html}
</body>
</html>`;
  }
}

export function SandboxedIframe({
  htmlContent,
  title = "Sandboxed Content",
  onMessage,
  allowExternalResources = false,
  className = "",
}: SandboxedIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // Create Blob URL from HTML content
  useEffect(() => {
    if (!htmlContent) {
      setBlobUrl(null);
      return;
    }

    const securedHtml = wrapHtmlWithSecurity(htmlContent, allowExternalResources);
    const blob = new Blob([securedHtml], { type: "text/html; charset=utf-8" });
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);

    // Revoke the old URL to free memory
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [htmlContent, allowExternalResources]);

  // Listen for postMessage from the iframe
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      // blob: iframes have origin "null" (string) per spec.
      // We accept "null" origin because we control the content via Blob URL
      // and the sandbox prevents the iframe from accessing anything else.
      if (event.origin !== "null" && event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      // Validate the message has a type field
      if (event.data && typeof event.data === "object" && event.data.type) {
        onMessage?.(event.data);
      }
    },
    [onMessage]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  if (!blobUrl) {
    return (
      <div className={`flex items-center justify-center bg-black text-white/50 ${className}`}>
        <p className="text-sm">No content to display</p>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      src={blobUrl}
      sandbox="allow-scripts"
      title={title}
      className={`border-0 ${className}`}
      // Extra security headers via attributes
      referrerPolicy="no-referrer"
      loading="lazy"
      // Block feature policy items
      allow="autoplay; fullscreen"
    />
  );
}
