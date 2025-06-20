// src/utils/greentextParser.js

/**
 * Parses a block of raw greentext into a structured object.
 * @param {string} rawText - The full greentext pasted by the admin.
 * @returns {object} - A structured object representing the Volume.
 */
export const parseRawGreentext = (rawText) => {
  // Return a default empty state if the input is empty
  if (!rawText.trim()) {
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

  // Split text into lines and trim whitespace from each line.
  const lines = rawText.split("\n").map((line) => line.trim());

  const parsedData = {
    volumeNumber: null,
    title: "",
    bodyLines: [],
    blessingIntro: "",
    blessings: [],
    dream: "",
    edition: "",
  };

  // Define keywords to identify key sections.
  const BLESSING_INTRO_KEYWORD = "life is";
  const DREAM_KEYWORD = "the dream of";
  const EDITION_KEYWORD = "Edition";

  // --- Parse Volume and Title from the first line ---
  const titleRegex = /Volume\s+(\d+)\s*–\s*(.*)/i;
  const firstLineMatch = lines[0]?.match(titleRegex); // Use optional chaining for safety
  if (firstLineMatch) {
    parsedData.volumeNumber = parseInt(firstLineMatch[1], 10);
    parsedData.title = firstLineMatch[2].trim();
  }

  // --- Find the line indexes for our key sections ---
  const blessingIntroIndex = lines.findIndex((line) =>
    line.toLowerCase().startsWith(BLESSING_INTRO_KEYWORD)
  );
  const dreamIndex = lines.findIndex((line) =>
    line.toLowerCase().startsWith(DREAM_KEYWORD)
  );
  const editionIndex = lines.findIndex((line) =>
    line.endsWith(EDITION_KEYWORD)
  );

  // --- Populate the sections based on indexes ---

  // Body: Lines between title (line 0) and the blessing intro.
  if (blessingIntroIndex !== -1) {
    parsedData.bodyLines = lines
      .slice(1, blessingIntroIndex)
      .filter((line) => line !== "");
  }

  // Blessing Intro
  if (blessingIntroIndex !== -1) {
    parsedData.blessingIntro = lines[blessingIntroIndex];
  }

  // Blessings: Lines between the blessing intro and the dream line.
  if (blessingIntroIndex !== -1 && dreamIndex !== -1) {
    const blessingLines = lines
      .slice(blessingIntroIndex + 1, dreamIndex)
      .filter((line) => line !== "");

    const blessingRegex = /^(.*?)(?:\s*\((.*)\))?$/;
    for (const line of blessingLines) {
      const match = line.match(blessingRegex);
      if (match) {
        parsedData.blessings.push({
          item: match[1].trim(),
          description: match[2] ? match[2].trim() : "",
        });
      }
    }
  }

  // Dream
  if (dreamIndex !== -1) {
    parsedData.dream = lines[dreamIndex];
  }

  // Edition
  if (editionIndex !== -1) {
    parsedData.edition = lines[editionIndex].split(":")[1]?.trim() || "";
  }

  return parsedData;
};
