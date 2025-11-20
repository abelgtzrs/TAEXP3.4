// Simple global toast event bus
// Usage: emitToast({ title, message, imageUrl, tag })
export const emitToast = (detail) => {
  try {
    const evt = new CustomEvent("tae:toast", { detail });
    window.dispatchEvent(evt);
  } catch (e) {
    // no-op
  }
};

export default { emitToast };
