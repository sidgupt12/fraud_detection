/**
 * Calm, warm-toned page background:
 *  - very faint grid (no animated pan)
 *  - subtle paper grain overlay
 *  - top vignette so the navbar blends into the page
 *  - soft warm gradient pillar from top-right (no neon blue)
 *
 * No scanlines, no radial pulses, no neon halos.
 */
export function AnimatedBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-quiet opacity-50" />
      <div className="absolute inset-0 grain opacity-[0.18] mix-blend-overlay" />
      <div
        className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(216,196,163,0.10), transparent)",
        }}
      />
      <div
        className="absolute -bottom-48 -left-32 h-[460px] w-[460px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(155,133,196,0.07), transparent)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bg/90 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg/90 to-transparent" />
    </div>
  );
}
