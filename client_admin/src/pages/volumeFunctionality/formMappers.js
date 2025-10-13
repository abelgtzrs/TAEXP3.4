// Mapping utilities for the volume form

export const toFormData = (volume) => ({
  rawPastedText: volume.rawPastedText || "",
  status: volume.status || "draft",
  volumeNumber: volume.volumeNumber ?? "",
  title: volume.title ?? "",
  bodyText: Array.isArray(volume.bodyLines) ? volume.bodyLines.join("\n") : "",
  blessingIntro: volume.blessingIntro ?? "",
  blessings: Array.isArray(volume.blessings) ? volume.blessings : [],
  dream: volume.dream ?? "",
  edition: volume.edition ?? "",
});

export const toPayload = (formData) => ({
  rawPastedText: formData.rawPastedText,
  status: formData.status,
  volumeNumber: formData.volumeNumber === "" ? null : Number(formData.volumeNumber),
  title: formData.title,
  bodyLines: (formData.bodyText || "")
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter((l) => true),
  blessingIntro: formData.blessingIntro,
  blessings: Array.isArray(formData.blessings) ? formData.blessings : [],
  dream: formData.dream,
  edition: formData.edition,
});
