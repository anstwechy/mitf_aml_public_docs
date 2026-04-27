/* Mermaid 10+: use window "load" so Material/Google Fonts are ready (avoids failed or blank render). */
(function () {
  async function runMermaid() {
    if (typeof mermaid === "undefined") {
      console.warn("[mermaid-init] mermaid global not found");
      return;
    }
    try {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        theme: "default",
        useMaxWidth: true,
      });
      await mermaid.run({ querySelector: ".mermaid" });
    } catch (err) {
      console.error("[mermaid-init]", err);
    }
  }

  function onReady() {
    if (document.readyState === "complete") {
      void runMermaid();
    } else {
      window.addEventListener("load", function onLoad() {
        window.removeEventListener("load", onLoad);
        void runMermaid();
      });
    }
  }

  onReady();
})();
