/**
 * Parses a block of raw greentext into a structured object.
 * This version uses a more robust method to identify section boundaries
 * and supports multiple blessing formats.
 * @param {string} rawText - The full greentext pasted by the admin.
 * @returns {object} - A structured object representing the Volume.
 */
export const parseRawGreentext = (rawText) => {
  if (!rawText || !rawText.trim()) {
    return {
      volumeNumber: null,
      title: "",
      bodyLines: [],
      blessingIntro: "",
      blessings: [],
      dream: "",
      edition: "",
    };
  }

  const lines = rawText.split("\n");

  const parsedData = {
    volumeNumber: null,
    title: "",
    bodyLines: [],
    blessingIntro: "",
    blessings: [],
    dream: "",
    edition: "",
  };

  const BLESSING_INTRO_KEYWORD = "life is";
  const DREAM_KEYWORD = "the dream of";

  const titleRegex = /Volume\s+(\d+)\s*–\s*(.*)/i;
  const firstLineMatch = lines[0]?.trim().match(titleRegex);
  if (firstLineMatch) {
    parsedData.volumeNumber = parseInt(firstLineMatch[1], 10);
    parsedData.title = firstLineMatch[2].trim();
    parsedData.edition = `${parsedData.title} Edition`;
  }

  const blessingIntroIndex = lines.findIndex((line) => line.trim().toLowerCase().startsWith(BLESSING_INTRO_KEYWORD));
  const dreamIndex = lines.findIndex((line) => line.trim().toLowerCase().startsWith(DREAM_KEYWORD));

  const specialSectionIndexes = [blessingIntroIndex, dreamIndex].filter((index) => index !== -1);
  const bodyEndIndex = specialSectionIndexes.length > 0 ? Math.min(...specialSectionIndexes) : lines.length;

  parsedData.bodyLines = lines.slice(1, bodyEndIndex).map((line) => line.trimEnd());

  if (blessingIntroIndex !== -1) {
    parsedData.blessingIntro = lines[blessingIntroIndex].trim();
    const endOfBlessings = dreamIndex > blessingIntroIndex ? dreamIndex : lines.length;
    const blessingLines = lines.slice(blessingIntroIndex + 1, endOfBlessings).filter((line) => line.trim() !== "");

    // --- THIS IS THE UPDATED REGEX ---
    // It now looks for either " (description)" OR " – description"
    const blessingRegex = /^(.*?)(?:\s*\((.*)\)|\s*–\s*(.*))?$/;
    for (const line of blessingLines) {
      const match = line.trim().match(blessingRegex);
      if (match) {
        parsedData.blessings.push({
          item: match[1].trim(),
          // Use the description from whichever format was matched
          description: match[2] || match[3] || "",
        });
      }
    }
  }

  if (dreamIndex !== -1) {
    parsedData.dream = lines[dreamIndex].trim();
  }

  return parsedData;
};
