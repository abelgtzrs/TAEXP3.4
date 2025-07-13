import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { THEMES } from "../assets/themes";
import HELP_TEXT from "./terminal/helpText";
import { getAboutText, getCatText } from "./terminal/getAboutText";
import { TextScramble } from "../utils/textScramble";

const api = axios.create({ baseURL: "https://taexp3-0.onrender.com/api/public" });

// --- CONFIGURATION ---
const BASE_TYPE_DELAY = 1;
const RANDOM_TYPE_DELAY = 15;
const GLITCH_CHANCE = 0.1;
const GLITCH_CHARS = "█▓▒░^&*%$#@!+";
const GLITCH_DELAY = 1;

const ScrambleOutput = ({ phrases, onComplete }) => {
  const elRef = useRef(null); // A ref to the DOM element we want to animate
  const fxRef = useRef(null); // A ref to hold our TextScramble instance

  useEffect(() => {
    // Initialize the TextScramble instance once the component mounts
    fxRef.current = new TextScramble(elRef.current);

    let counter = 0;
    const next = () => {
      if (counter < phrases.length) {
        fxRef.current.setText(phrases[counter]).then(() => {
          setTimeout(() => {
            counter++;
            next();
          }, 800); // Pause between phrases
        });
      } else {
        // When all phrases are done, call the onComplete callback.
        if (onComplete) {
          onComplete();
        }
      }
    };
    next(); // Start the animation cycle
  }, [phrases, onComplete]); // Rerun if phrases change

  // The 'scrambling-char' class gives us a hook for styling the effect
  return <div ref={elRef} className="text-rose-400 font-mono" />;
};

const Terminal = () => {
  // --- STATE MANAGEMENT ---
  const [startTime] = useState(Date.now());
  const [theme, setTheme] = useState("default");
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("terminalFavorites")) || []);
  const [lines, setLines] = useState([
    {
      text: "The Abel Experience™ Cognitive Framework v3.0 — Distributed Terminal Interface | Encrypted | Monitored",
      type: "system",
    },
    {
      text: "Session initialized: Core modules linked | Memory sectors mapped | Operator input unlocked",
      type: "system",
    },
    {
      text: 'Type "help" to display available commands.',
      type: "info",
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [scrambleData, setScrambleData] = useState(null);

  // NEW state to handle the multi-step 'connect' command
  const [loginStep, setLoginStep] = useState("none"); // 'none', 'awaiting_password'
  const [loginEmail, setLoginEmail] = useState("");

  const inputRef = useRef(null);
  const endOfLinesRef = useRef(null);

  // --- EFFECTS ---
  useEffect(() => {
    inputRef.current?.focus();
  }, [isProcessing]);
  useEffect(() => {
    endOfLinesRef.current?.scrollIntoView();
  }, [lines]);
  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("terminalFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // --- HELPER FUNCTIONS ---
  const addLines = (newLines) => setLines((prev) => [...prev, ...newLines]);

  // --- THIS FUNCTION IS UPDATED with speed config and glitch effects ---
  const typeLines = async (linesToType) => {
    setIsProcessing(true);
    for (const line of linesToType) {
      let currentText = "";
      setLines((prev) => [...prev, { text: "", type: line.type, isTyping: true }]);

      for (let i = 0; i < line.text.length; i++) {
        // Check if this character should glitch
        if (Math.random() < GLITCH_CHANCE && line.text[i] !== " ") {
          // --- Glitch Effect Logic ---
          const randomGlitchChar = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          // Show the glitch character
          setLines((prev) => {
            const nextLines = [...prev];
            nextLines[nextLines.length - 1].text = currentText + randomGlitchChar;
            return nextLines;
          });
          await new Promise((resolve) => setTimeout(resolve, GLITCH_DELAY));
        }

        // Add the correct character
        currentText += line.text[i];
        setLines((prev) => {
          const nextLines = [...prev];
          nextLines[nextLines.length - 1].text = currentText;
          return nextLines;
        });

        // Wait for the configured typing delay
        const delay = BASE_TYPE_DELAY + Math.random() * RANDOM_TYPE_DELAY;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      // Mark the line as finished typing
      setLines((prev) => {
        const nextLines = [...prev];
        nextLines[nextLines.length - 1].isTyping = false;
        return nextLines;
      });
    }
    setIsProcessing(false);
  };

  const displayVolume = async (volumeData) => {
    let linesToDisplay = [];
    linesToDisplay.push({
      text: `--- Initializing The Abel Experience™ Volume ${volumeData.volumeNumber}: ${volumeData.title} ---`,
      type: "system",
    });
    linesToDisplay.push({ text: ` `, type: "info" });

    volumeData.bodyLines.forEach((line) => {
      const formattedLine = line.trim() === "" ? "" : `> ${line}`;
      linesToDisplay.push({
        text: formattedLine,
        type: "greentext",
      });
    });

    if (volumeData.blessings && volumeData.blessings.length > 0) {
      linesToDisplay.push({ text: ` `, type: "info" });
      linesToDisplay.push({ text: volumeData.blessingIntro, type: "system" });
      volumeData.blessings.forEach((b) => {
        const formattedBlessing = `- ${b.item} (${b.description})`;
        linesToDisplay.push({ text: formattedBlessing, type: "info" });
      });
    }
    if (volumeData.dream) {
      linesToDisplay.push({ text: ` `, type: "info" });
      linesToDisplay.push({ text: volumeData.dream, type: "system" });
    }
    if (volumeData.edition) {
      linesToDisplay.push({ text: ` `, type: "info" });
      const formattedEdition = `The Abel Experience™: ${volumeData.edition}`;
      linesToDisplay.push({ text: formattedEdition, type: "system" });
    }
    await typeLines(linesToDisplay);
  };

  const displayVolumeScrambled = async (volumeData) => {
    // Start with header
    await typeLines([
      {
        text: `--- VOIDZ ACCESS: Volume ${volumeData.volumeNumber}: ${volumeData.title} ---`,
        type: "system",
      },
      { text: ` `, type: "info" },
    ]);

    // Prepare all lines to be scrambled
    let allLines = [];

    volumeData.bodyLines.forEach((line) => {
      const formattedLine = line.trim() === "" ? "" : `> ${line}`;
      allLines.push(formattedLine);
    });

    if (volumeData.blessings && volumeData.blessings.length > 0) {
      allLines.push(""); // Empty line
      allLines.push(volumeData.blessingIntro);
      volumeData.blessings.forEach((b) => {
        const formattedBlessing = `- ${b.item} (${b.description})`;
        allLines.push(formattedBlessing);
      });
    }
    if (volumeData.dream) {
      allLines.push(""); // Empty line
      allLines.push(volumeData.dream);
    }
    if (volumeData.edition) {
      allLines.push(""); // Empty line
      const formattedEdition = `The Abel Experience™: ${volumeData.edition}`;
      allLines.push(formattedEdition);
    }

    // Display each line with scrambling effect
    for (const line of allLines) {
      if (line === "") {
        // Add empty lines immediately
        addLines([{ text: "", type: "info" }]);
        await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
      } else {
        // Add a placeholder line that will be scrambled
        let currentLineIndex;
        setLines((prev) => {
          currentLineIndex = prev.length; // Get the index before adding
          return [...prev, { text: "", type: "scrambling" }];
        });

        // Wait for the DOM to update
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Find the DOM element for this line and apply scrambling
        const lineElement = document.querySelector(`[data-line-index="${currentLineIndex}"]`);
        if (lineElement) {
          const scrambler = new TextScramble(lineElement);
          await scrambler.setText(line);
        }

        // Small delay between lines for effect
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }
  };

  // --- COMMAND PROCESSING ---
  const processCommand = async (command) => {
    const [cmd, ...args] = command.trim().toLowerCase().split(" ");
    setIsProcessing(true);

    switch (cmd) {
      case "help":
        await typeLines(HELP_TEXT);
        break;

      case "about":
        const aboutLines = getAboutText()
          .split("\n")
          .map((line) => ({ text: line, type: "info" }));
        await typeLines(aboutLines);
        break;

      case "cat":
        const catLines = getCatText()
          .split("\n")
          .map((line) => ({ text: line, type: "info" }));
        await typeLines(catLines);
        break;

      case "date":
        await typeLines([{ text: new Date().toString(), type: "info" }]);
        break;

      case "connect":
        addLines([
          {
            text: "Redirecting to secure Admin Panel login...",
            type: "system",
          },
        ]);
        // The simplest, most secure way to "connect" is to open the admin panel in a new tab.
        // Directly handling passwords here would be a security risk.
        window.open("http://localhost:5173/login", "_blank"); // Opens your admin panel URL
        break;

      case "stats":
        const statsNum = parseInt(args[0]);
        if (!statsNum) {
          await typeLines([{ text: "Usage: stats [volume number]", type: "error" }]);
          break;
        }
        try {
          const res = await api.get(`/volumes/id/${statsNum}`);
          const vol = res.data.data;
          await typeLines([
            {
              text: `--- STATISTICS FOR VOLUME ${vol.volumeNumber} ---`,
              type: "system",
            },
            { text: `Title: ${vol.title}`, type: "info" },
            {
              text: `Times Favorited: ${vol.favoriteCount || 0}`,
              type: "info",
            },
            {
              text: `Number of Ratings: ${vol.ratingCount || 0}`,
              type: "info",
            },
            {
              text: `Average Rating: ${vol.averageRating ? vol.averageRating.toFixed(1) : "N/A"} / 100`,
              type: "info",
            },
          ]);
        } catch (error) {
          await typeLines([
            {
              text: `Error: Could not retrieve stats for Volume ${statsNum}.`,
              type: "error",
            },
          ]);
        }
        break;

      case "blessing":
        try {
          const res = await api.get("/motd");
          const blessing = res.data.data;
          await typeLines([
            {
              text: `[Random Blessing] - ${blessing.item} (${blessing.description})`,
              type: "system",
            },
          ]);
        } catch (error) {
          await typeLines([
            {
              text: "Error: Could not retrieve Message of the Day.",
              type: "error",
            },
          ]);
        }
        break;

      case "latest":
        try {
          const res = await api.get("/volumes/latest");
          await displayVolume(res.data.data);
        } catch (error) {
          await typeLines([{ text: "Error: Could not fetch latest volume.", type: "error" }]);
        }
        break;

      case "search":
        if (!args[0]) {
          await typeLines([{ text: "Usage: search [keyword]", type: "error" }]);
          break;
        }
        try {
          const res = await api.get(`/volumes/search?q=${args.join(" ")}`);
          let searchResultLines = res.data.data.map((vol) => ({
            text: `Volume ${vol.volumeNumber}: ${vol.title}`,
            type: "info",
          }));
          if (searchResultLines.length === 0) {
            searchResultLines.push({
              text: "No matching volumes found.",
              type: "info",
            });
          }
          searchResultLines.unshift({
            text: `--- Search results for "${args.join(" ")}" ---`,
            type: "system",
          });
          await typeLines(searchResultLines);
        } catch (error) {
          await typeLines([{ text: "Error during search.", type: "error" }]);
        }
        break;

      case "theme":
        const inputTheme = args[0];
        if (!inputTheme) {
          await typeLines([
            {
              text: 'Usage: theme [name]. Type "themes" to see available options.',
              type: "error",
            },
          ]);
          break;
        }

        // Find theme case-insensitively
        const availableThemes = Object.keys(THEMES);
        const matchedTheme = availableThemes.find((theme) => theme.toLowerCase() === inputTheme.toLowerCase());

        if (matchedTheme) {
          setTheme(matchedTheme);
          await typeLines([{ text: `Theme set to '${matchedTheme}'.`, type: "system" }]);
        } else {
          await typeLines([
            {
              text: `Error: Theme not found. Available: ${availableThemes.join(", ")}`,
              type: "error",
            },
          ]);
        }
        break;

      case "themes":
        const themeLines = Object.keys(THEMES).map((themeName) => ({
          text: `${themeName}`,
          type: "info",
        }));
        themeLines.unshift({
          text: "--- Available Themes ---",
          type: "system",
        });
        await typeLines(themeLines);
        break;

      case "favorite":
        const favNum = parseInt(args[0]);
        if (!favNum) {
          await typeLines([{ text: "Usage: favorite [volume number]", type: "error" }]);
          break;
        }
        try {
          // Call the new backend endpoint to increment the global count
          await api.post(`/volumes/${favNum}/favorite`);
          // Also save to local storage for the 'favorites' command
          if (!favorites.includes(favNum)) {
            setFavorites((prev) => [...prev, favNum].sort((a, b) => a - b));
          }
          await typeLines([{ text: `Volume ${favNum} favorited! Thank you.`, type: "system" }]);
        } catch (error) {
          await typeLines([
            {
              text: error.response?.data?.message || "Could not favorite volume.",
              type: "error",
            },
          ]);
        }
        break;

      case "favorites":
        let favLines = favorites.map((num) => ({
          text: `Volume ${num}`,
          type: "info",
        }));
        if (favLines.length === 0) {
          favLines.push({
            text: "You have no favorited volumes.",
            type: "info",
          });
        }
        favLines.unshift({
          text: "--- Your Favorite Volumes ---",
          type: "system",
        });
        await typeLines(favLines);
        break;

      case "rate":
        const rateNum = parseInt(args[0]);
        const ratingVal = parseInt(args[1]);
        if (!rateNum || !ratingVal || ratingVal < 1 || ratingVal > 100) {
          await typeLines([
            {
              text: "Usage: rate [volume number] [rating 1-100]",
              type: "error",
            },
          ]);
          break;
        }
        try {
          const res = await api.post("/volumes/rate", {
            volumeNumber: rateNum,
            rating: ratingVal,
          });
          await typeLines([{ text: res.data.message, type: "system" }]);
        } catch (error) {
          await typeLines([
            {
              text: error.response?.data?.message || "Error submitting rating.",
              type: "error",
            },
          ]);
        }
        break;

      case "clear":
        setLines([]);
        break;
      case "catalogue":
        try {
          const res = await api.get("/volumes/catalogue");
          const catalogueLines = res.data.data.map((vol) => ({
            text: `Volume ${vol.volumeNumber}: ${vol.title}`,
            type: "info",
          }));
          catalogueLines.unshift({
            text: "--- Published Volumes ---",
            type: "system",
          });
          await typeLines(catalogueLines);
        } catch (error) {
          await typeLines([{ text: "Error: Could not fetch volume catalogue.", type: "error" }]);
        }
        break;
      case "random":
        try {
          const res = await api.get("/volumes/random");
          await displayVolume(res.data.data);
        } catch (error) {
          await typeLines([{ text: "Error: Could not fetch random volume.", type: "error" }]);
        }
        break;
      case "view":
        if (!args[0] || isNaN(parseInt(args[0]))) {
          await typeLines([
            {
              text: "Error: Please provide a valid volume number. Usage: view [number]",
              type: "error",
            },
          ]);
          break;
        }
        try {
          const res = await api.get(`/volumes/id/${args[0]}`);
          await displayVolume(res.data.data);
        } catch (error) {
          await typeLines([
            {
              text: `Error: Volume ${args[0]} not found or is not published.`,
              type: "error",
            },
          ]);
        }
        break;
      case "voidz":
        if (!args[0] || isNaN(parseInt(args[0]))) {
          // If no volume number provided, show the original scramble effect
          setScrambleData({
            key: Date.now(),
            phrases: [
              "INITIATING COGNITIVE SYNC...",
              "ACCESSING THE VOIDZ...",
              "REALITY MATRIX COMPROMISED.",
              "ERROR: UNSTABLE PARADIGM.",
              "RESTORING... OK.",
            ],
          });
        } else {
          // If volume number provided, display that volume with scrambling effects
          try {
            const res = await api.get(`/volumes/id/${args[0]}`);
            await displayVolumeScrambled(res.data.data);
          } catch (error) {
            await typeLines([
              {
                text: `Error: Volume ${args[0]} not found in the VOIDZ or is not published.`,
                type: "error",
              },
            ]);
          }
        }
        break;
      case "export":
        const start = parseInt(args[0]);
        const end = parseInt(args[1]);
        if (!start || !end || start > end) {
          await typeLines([
            {
              text: "Usage: export [start_number] [end_number]",
              type: "error",
            },
          ]);
          break;
        }
        try {
          addLines([{ text: `Exporting volumes ${start} to ${end}...`, type: "system" }]);
          const res = await api.post("/volumes/export", { start, end });
          const content = res.data.data.content;

          // Client-side logic to trigger a download
          const blob = new Blob([content], {
            type: "text/plain;charset=utf-8",
          });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `Abel_Experience_Export_${start}-${end}.txt`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          await typeLines([{ text: "Export complete. Check your downloads.", type: "system" }]);
        } catch (error) {
          await typeLines([
            {
              text: error.response?.data?.message || "Error during export.",
              type: "error",
            },
          ]);
        }
        break;
      default:
        if (command.trim() !== "") {
          await typeLines([
            {
              text: `Command not found: ${command}. Type 'help' for a list of commands.`,
              type: "error",
            },
          ]);
        }
        break;
    }
    setIsProcessing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isProcessing) {
      const command = input.trim();
      addLines([{ text: `> ${command}`, type: "user" }]);
      processCommand(command);
      setInput("");
    }
  };

  // --- JSX RENDER ---
  const currentTheme = THEMES[theme] || THEMES.default;
  return (
    <div className={`w-full h-[95vh] p-2 text-xs`} onClick={() => inputRef.current?.focus()}>
      <div className="overflow-y-auto h-full">
        {/* Render the normal command history */}
        {lines.map((line, index) => {
          const lineStyle = currentTheme[line.type] || currentTheme.info;
          const displayText = line.text.trim() === "" ? "\u00A0" : line.text;

          // Special handling for scrambling lines
          if (line.type === "scrambling") {
            return (
              <div key={index} className="flex">
                <pre
                  className={`whitespace-pre-wrap leading-relaxed ${currentTheme.greentext}`}
                  data-line-index={index}
                >
                  {displayText}
                </pre>
              </div>
            );
          }

          return (
            <div key={index} className="flex">
              <pre className={`whitespace-pre-wrap leading-relaxed ${lineStyle}`}>{displayText}</pre>
              {line.isTyping && <span className={`blinking-cursor ${currentTheme.cursor}`}>▋</span>}
            </div>
          );
        })}

        {/* --- Conditionally render the scramble component --- */}
        {scrambleData && (
          <ScrambleOutput
            key={scrambleData.key}
            phrases={scrambleData.phrases}
            onComplete={() => setScrambleData(null)} // Clear the data when animation finishes
          />
        )}

        <div ref={endOfLinesRef} />
      </div>

      {/* Input area remains the same */}
      <div className="flex mt-2">
        <span className={`${currentTheme.user}`}>&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          className={`flex-grow bg-transparent border-none focus:ring-0 focus:outline-none ml-2 ${currentTheme.user}`}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default Terminal;
