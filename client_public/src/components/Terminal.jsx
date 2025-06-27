import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api/public' });

// --- CONFIGURATION ---
const BASE_TYPE_DELAY = 8;
const RANDOM_TYPE_DELAY = 15;
const GLITCH_CHANCE = 1;
const GLITCH_CHARS = '█▓▒░^&*%$#@!+';
const GLITCH_DELAY = 15;

// NEW: Theme configuration
const THEMES = {
    default: {
        system: 'text-teal-400',
        info: 'text-gray-300',
        error: 'text-red-500',
        greentext: 'text-green-500',
        user: 'text-white',
        cursor: 'text-teal-400'
    },
    // Classic "Fallout" / "Alien" amber terminal
    amber: {
        system: 'text-amber-400',
        info: 'text-amber-200',
        error: 'text-red-500',
        greentext: 'text-amber-300',
        user: 'text-amber-100',
        cursor: 'text-amber-400'
    },
    // The Matrix-style green on black
    matrix: {
        system: 'text-green-400',
        info: 'text-green-300',
        error: 'text-red-500',
        greentext: 'text-green-500',
        user: 'text-green-200',
        cursor: 'text-green-400'
    },
    // A cyberpunk / dystopian magenta and rose theme
    rose: {
        system: 'text-rose-400',
        info: 'text-rose-200',
        error: 'text-yellow-400', // Yellow for error pops nicely against pink/rose
        greentext: 'text-green-400',
        user: 'text-white',
        cursor: 'text-rose-400'
    },
    // A cool, professional, corporate sci-fi blue
    sky: {
        system: 'text-sky-400',
        info: 'text-sky-200',
        error: 'text-red-500',
        greentext: 'text-green-400',
        user: 'text-white',
        cursor: 'text-sky-400'
    },
    // A deep space, cosmic purple/indigo theme
    void: {
        system: 'text-indigo-400',
        info: 'text-purple-300',
        error: 'text-rose-500',
        greentext: 'text-green-400',
        user: 'text-white',
        cursor: 'text-indigo-400'
    },
    // A stark, minimalist black & white theme
    noir: {
        system: 'text-white',
        info: 'text-gray-400',
        error: 'text-white bg-red-800', // Inverted error for visibility
        greentext: 'text-gray-200', // Greentext is just slightly off-white
        user: 'text-white font-bold',
        cursor: 'text-white'
    },
    // A critical "alert" or "emergency" theme
    crimson: {
        system: 'text-red-500',
        info: 'text-red-300',
        error: 'text-yellow-400',
        greentext: 'text-red-400',
        user: 'text-red-200',
        cursor: 'text-red-500'},
      // dark-violet HUD inspired by your Quantum skin
  quantum: {
    system:   'text-violet-400',
    info:     'text-violet-300',
    error:    'text-rose-500',
    greentext:'text-indigo-400',
    user:     'text-fuchsia-300',
    cursor:   'text-violet-400',
  },

  // warm-orange vibe for Strokes-themed sessions
  sunset: {
    system:   'text-orange-400',
    info:     'text-amber-300',
    error:    'text-red-500',
    greentext:'text-amber-400',
    user:     'text-yellow-200',
    cursor:   'text-orange-400',
  },

  // Blanco y Oro (Real Madrid) palette
  madrid: {
    system:   'text-slate-200',
    info:     'text-slate-100',
    error:    'text-rose-500',
    greentext:'text-indigo-400',
    user:     'text-yellow-300',
    cursor:   'text-slate-200',
  },

  // Nord-like ice blues for calm coding
  polar: {
    system:   'text-sky-300',
    info:     'text-sky-200',
    error:    'text-rose-400',
    greentext:'text-teal-300',
    user:     'text-sky-100',
    cursor:   'text-sky-300',
  },

  // Solarized-dark adaptation
  solar: {
    system:   'text-emerald-300',
    info:     'text-cyan-300',
    error:    'text-rose-500',
    greentext:'text-emerald-400',
    user:     'text-amber-300',
    cursor:   'text-emerald-300',
  },

  // Cyberpunk neon burst
  city: {
    system:   'text-cyan-400',
    info:     'text-pink-400',
    error:    'text-rose-500',
    greentext:'text-lime-400',
    user:     'text-fuchsia-300',
    cursor:   'text-cyan-400',
  },

  // Classic Monokai
  monokai: {
    system:   'text-lime-400',
    info:     'text-cyan-300',
    error:    'text-rose-500',
    greentext:'text-lime-500',
    user:     'text-yellow-300',
    cursor:   'text-lime-400',
  },
};

// NEW: Help text constant
const HELP_TEXT = [
    { text: '--- The Abel Experience™ CFW Help ---', type: 'system' },
    { text: '> about                - Display information about this project.', type: 'info' },
    { text: '> help                 - Shows this list of commands.', type: 'info' },
    { text: '> motd                 - Displays the Message of the Day.', type: 'info' },
    { text: '> date                 - Displays the current system date and time.', type: 'info' },
    { text: '> catalogue            - View all published volumes.', type: 'info' },
    { text: '> latest               - View the most recent volume.', type: 'info' },
    { text: '> random               - View a random volume.', type: 'info' },
    { text: '> search [keyword]     - Search for volumes by keyword.', type: 'info' },
    { text: '> view [number]        - View a specific volume by number.', type: 'info' },
    { text: '> favorite [num]       - Add a volume to your local favorites.', type: 'info' },
    { text: '> favorites            - View your list of favorited volumes.', type: 'info' },
    { text: '> rate [num] [1-100]   - Rate a specific volume.', type: 'info' },
    { text: '> theme [name]         - Change terminal color theme.', type: 'info' },
    { text: '> themes               - List all available themes.', type: 'info' },
    { text: '> clear                - Clear the terminal screen.', type: 'info' },
];

const getAboutText = () => {
    const uptimeMinutes = Math.floor(Date.now() / 60000);
    return `
  ,ad8888ba,        CFW v3.0 (Cognitive Framework)
 d8"'    \`"8b       ------------------------------------
d8'                 OS:         The Abel Experience™ CFW
88                  Host:       5174
88                  Kernel:     Node.js v22.12.0
88                  Uptime:     ${uptimeMinutes} minutes
Y8,                 Shell:      VISITOR
 Y8a.    .a8P       Resolution: Dynamic
  \`"Y8888Y"'        Terminal:   react-terminal-interface
`;
};

const Terminal = () => {
    // --- STATE MANAGEMENT ---
    const [theme, setTheme] = useState('default');
    const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('terminalFavorites')) || []);
    const [lines, setLines] = useState([
        { text: 'The Abel Experience™ CFW v3.0 Terminal Initialized.', type: 'system' },
        { text: 'Type "help" for a list of commands.', type: 'info' }
    ]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    
    const inputRef = useRef(null);
    const endOfLinesRef = useRef(null);

    // --- EFFECTS ---
    useEffect(() => { inputRef.current?.focus(); }, [isProcessing]);
    useEffect(() => { endOfLinesRef.current?.scrollIntoView(); }, [lines]);
    // Save favorites to localStorage whenever they change
    useEffect(() => { localStorage.setItem('terminalFavorites', JSON.stringify(favorites)); }, [favorites]);

    // --- HELPER FUNCTIONS ---
    const addLines = (newLines) => setLines(prev => [...prev, ...newLines]);

    // --- THIS FUNCTION IS UPDATED with speed config and glitch effects ---
    const typeLines = async (linesToType) => {
        setIsProcessing(true);
        for (const line of linesToType) {
            let currentText = '';
            setLines(prev => [...prev, { text: '', type: line.type, isTyping: true }]);
            
            for (let i = 0; i < line.text.length; i++) {
                // Check if this character should glitch
                if (Math.random() < GLITCH_CHANCE && line.text[i] !== ' ') {
                    // --- Glitch Effect Logic ---
                    const randomGlitchChar = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
                    // Show the glitch character
                    setLines(prev => {
                        const nextLines = [...prev];
                        nextLines[nextLines.length - 1].text = currentText + randomGlitchChar;
                        return nextLines;
                    });
                    await new Promise(resolve => setTimeout(resolve, GLITCH_DELAY));
                }
                
                // Add the correct character
                currentText += line.text[i];
                setLines(prev => {
                    const nextLines = [...prev];
                    nextLines[nextLines.length - 1].text = currentText;
                    return nextLines;
                });

                // Wait for the configured typing delay
                const delay = BASE_TYPE_DELAY + Math.random() * RANDOM_TYPE_DELAY;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            // Mark the line as finished typing
            setLines(prev => {
                const nextLines = [...prev];
                nextLines[nextLines.length - 1].isTyping = false;
                return nextLines;
            });
        }
        setIsProcessing(false);
    };
    
    const displayVolume = async (volumeData) => {
        let linesToDisplay = [];
        linesToDisplay.push({ text: `--- Initializing The Abel Experience™ Volume ${volumeData.volumeNumber}: ${volumeData.title} ---`, type: 'system' });
        linesToDisplay.push({ text: ` `, type: 'info' });

        volumeData.bodyLines.forEach(line => {
            const formattedLine = line.trim() === '' ? '' : `> ${line}`;
            linesToDisplay.push({
                text: formattedLine,
                type: 'greentext'
            });
        });

        if (volumeData.blessings && volumeData.blessings.length > 0) {
            linesToDisplay.push({ text: ` `, type: 'info' });
            linesToDisplay.push({ text: volumeData.blessingIntro, type: 'system' });
            volumeData.blessings.forEach(b => {
                const formattedBlessing = `- ${b.item} (${b.description})`;
                linesToDisplay.push({ text: formattedBlessing, type: 'info' });
            });
        }
        if (volumeData.dream) {
            linesToDisplay.push({ text: ` `, type: 'info' });
            linesToDisplay.push({ text: volumeData.dream, type: 'system' });
        }
                if (volumeData.edition) {
            linesToDisplay.push({ text: ` `, type: 'info' });
            const formattedEdition = `The Abel Experience™: ${volumeData.edition}`;
            linesToDisplay.push({ text: formattedEdition, type: 'system' });
        }
        await typeLines(linesToDisplay);
    };


    // --- COMMAND PROCESSING ---
    const processCommand = async (command) => {
        const [cmd, ...args] = command.trim().toLowerCase().split(' ');
        setIsProcessing(true);

        switch (cmd) {
            case 'help':
                await typeLines(HELP_TEXT);
                break;
            
            case 'about':
                const aboutLines = getAboutText().split('\n').map(line => ({ text: line, type: 'info' }));
                await typeLines(aboutLines);
                break;

            case 'date':
                await typeLines([{ text: new Date().toString(), type: 'info' }]);
                break;

            case 'blessing':
                try {
                    const res = await api.get('/motd');
                    const blessing = res.data.data;
                    await typeLines([{ text: `[Random Blessing] - ${blessing.item} (${blessing.description})`, type: 'system' }]);
                } catch (error) { await typeLines([{ text: 'Error: Could not retrieve Message of the Day.', type: 'error' }]); }
                break;
            
            case 'latest':
                try {
                    const res = await api.get('/volumes/latest');
                    await displayVolume(res.data.data);
                } catch (error) { await typeLines([{ text: 'Error: Could not fetch latest volume.', type: 'error' }]); }
                break;

            case 'search':
                if (!args[0]) { await typeLines([{ text: 'Usage: search [keyword]', type: 'error' }]); break; }
                try {
                    const res = await api.get(`/volumes/search?q=${args.join(' ')}`);
                    let searchResultLines = res.data.data.map(vol => ({ text: `Volume ${vol.volumeNumber}: ${vol.title}`, type: 'info' }));
                    if (searchResultLines.length === 0) { searchResultLines.push({ text: 'No matching volumes found.', type: 'info' }); }
                    searchResultLines.unshift({ text: `--- Search results for "${args.join(' ')}" ---`, type: 'system' });
                    await typeLines(searchResultLines);
                } catch (error) { await typeLines([{ text: 'Error during search.', type: 'error' }]); }
                break;

            case 'theme':
                const inputTheme = args[0];
                if (!inputTheme) {
                    await typeLines([{ text: 'Usage: theme [name]. Type "themes" to see available options.', type: 'error' }]);
                    break;
                }
                
                // Find theme case-insensitively
                const availableThemes = Object.keys(THEMES);
                const matchedTheme = availableThemes.find(theme => theme.toLowerCase() === inputTheme.toLowerCase());
                
                if (matchedTheme) {
                    setTheme(matchedTheme);
                    await typeLines([{ text: `Theme set to '${matchedTheme}'.`, type: 'system' }]);
                } else {
                    await typeLines([{ text: `Error: Theme not found. Available: ${availableThemes.join(', ')}`, type: 'error' }]);
                }
                break;

            case 'themes':
                const themeLines = Object.keys(THEMES).map(themeName => ({ text: `${themeName}`, type: 'info' }));
                themeLines.unshift({ text: '--- Available Themes ---', type: 'system' });
                await typeLines(themeLines);
                break;

            case 'favorite':
                const favNum = parseInt(args[0]);
                if (!favNum) { await typeLines([{ text: 'Usage: favorite [volume number]', type: 'error' }]); break; }
                if (favorites.includes(favNum)) {
                    await typeLines([{ text: `Volume ${favNum} is already in your favorites.`, type: 'info' }]);
                } else {
                    setFavorites(prev => [...prev, favNum]);
                    await typeLines([{ text: `Added Volume ${favNum} to local favorites.`, type: 'system' }]);
                }
                break;

            case 'favorites':
                let favLines = favorites.map(num => ({ text: `Volume ${num}`, type: 'info' }));
                if (favLines.length === 0) { favLines.push({ text: 'You have no favorited volumes.', type: 'info' }); }
                favLines.unshift({ text: '--- Your Favorite Volumes ---', type: 'system' });
                await typeLines(favLines);
                break;

            case 'rate':
                const rateNum = parseInt(args[0]);
                const ratingVal = parseInt(args[1]);
                if (!rateNum || !ratingVal || ratingVal < 1 || ratingVal > 100) {
                    await typeLines([{ text: 'Usage: rate [volume number] [rating 1-100]', type: 'error' }]);
                    break;
                }
                try {
                    const res = await api.post('/volumes/rate', { volumeNumber: rateNum, rating: ratingVal });
                    await typeLines([{ text: res.data.message, type: 'system' }]);
                } catch (error) { await typeLines([{ text: error.response?.data?.message || 'Error submitting rating.', type: 'error' }]); }
                break;
            case 'clear':
                setLines([]);
                break;
            case 'catalogue':
                try {
                    const res = await api.get('/volumes/catalogue');
                    const catalogueLines = res.data.data.map(vol => ({ text: `Volume ${vol.volumeNumber}: ${vol.title}`, type: 'info' }));
                    catalogueLines.unshift({ text: '--- Published Volumes ---', type: 'system' });
                    await typeLines(catalogueLines);
                } catch (error) { await typeLines([{ text: 'Error: Could not fetch volume catalogue.', type: 'error' }]); }
                break;
            case 'random':
                try {
                    const res = await api.get('/volumes/random');
                    await displayVolume(res.data.data);
                } catch (error) { await typeLines([{ text: 'Error: Could not fetch random volume.', type: 'error' }]); }
                break;
            case 'view':
                if (!args[0] || isNaN(parseInt(args[0]))) {
                    await typeLines([{ text: 'Error: Please provide a valid volume number. Usage: view [number]', type: 'error' }]);
                    break;
                }
                try {
                    const res = await api.get(`/volumes/id/${args[0]}`);
                    await displayVolume(res.data.data);
                } catch (error) { await typeLines([{ text: `Error: Volume ${args[0]} not found or is not published.`, type: 'error' }]);}
                break;
            default:
                 if (command.trim() !== '') {
                    await typeLines([{ text: `Command not found: ${command}. Type 'help' for a list of commands.`, type: 'error' }]);
                }
                break;
        }
        setIsProcessing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isProcessing) {
            const command = input.trim();
            addLines([{ text: `> ${command}`, type: 'user' }]);
            processCommand(command);
            setInput('');
        }
    };
    
    // --- JSX RENDER ---
    const currentTheme = THEMES[theme] || THEMES.default;
    return (
        <div className={`w-full h-[95vh] p-2 text-[12px]`} onClick={() => inputRef.current?.focus()}>
            <div className="overflow-y-auto h-full">
                {lines.map((line, index) => {
                    const lineStyle = currentTheme[line.type] || currentTheme.info;
                    const displayText = line.text.trim() === '' ? '\u00A0' : line.text;
                    return (
                        <div key={index} className="flex">
                            <pre className={`whitespace-pre-wrap leading-relaxed ${lineStyle}`}>{displayText}</pre>
                            {line.isTyping && <span className={`blinking-cursor ${currentTheme.cursor}`}>▋</span>}
                        </div>
                    );
                })}
                <div ref={endOfLinesRef} />
            </div>

            <div className="flex mt-2">
                <span className={`${currentTheme.user}`}>&gt;</span>
                <input
                    ref={inputRef} type="text" value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown} disabled={isProcessing}
                    className={`flex-grow bg-transparent border-none focus:ring-0 focus:outline-none ml-2 ${currentTheme.user}`}
                    autoComplete="off"
                />
            </div>
        </div>
    );
};

export default Terminal;