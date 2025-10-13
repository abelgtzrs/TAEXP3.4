// Helpers for building and handling exports of volumes

export const buildExportText = (published) => {
  const lines = [];

  (published || [])
    .slice()
    .sort((a, b) => (a.volumeNumber ?? 0) - (b.volumeNumber ?? 0))
    .forEach((v, idx) => {
      const title = v?.title ?? "Untitled";
      const volNum = v?.volumeNumber ?? "—";
      const edition = v?.edition ? ` ${v.edition}` : "";

      // Header line
      lines.push(`The Abel Experience Volume ${volNum}: ${title}${edition}`);

      // Body section (raw body lines)
      const body = Array.isArray(v.bodyLines) ? v.bodyLines : [];
      if (body.length) {
        lines.push("");
        body.forEach((l) => lines.push(l));
      }

      // Life is section
      if (v.blessingIntro) {
        lines.push("");
        lines.push(`Life is: ${v.blessingIntro}`);
      }

      // Blessings section (one per line: "Name - Description")
      if (Array.isArray(v.blessings) && v.blessings.length > 0) {
        lines.push("");
        v.blessings.forEach((b, i) => {
          const item = b?.item ?? `Blessing ${i + 1}`;
          const desc = (b?.description ?? "").trim();
          lines.push(`${item}${desc ? ` - ${desc}` : ""}`);
        });
      }

      // Dream section (as provided)
      if (v.dream) {
        lines.push("");
        lines.push(v.dream);
      }

      // Closing line
      lines.push("");
      lines.push(`The Abel Experience: ${title}${edition}`);

      // Blank line between volumes (except maybe after last; keep for consistency)
      if (idx !== (published?.length ?? 0) - 1) {
        lines.push("");
      }
    });

  return lines.join("\n");
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch {
      return false;
    }
  }
};

export const downloadTxt = (text, prefix = "volumes-export") => {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  a.download = `${prefix}-${timestamp}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
