// src/components/Terminal.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// A simple API instance for this client
const api = axios.create({ baseURL: 'http://localhost:5000/api/public' });

const Terminal = () => {
    // --- STATE MANAGEMENT ---
    // `lines` holds the history of everything displayed on the terminal.
    // Each line is an object with text and a specific style 'type'.
    const [lines, setLines] = useState([
        { text: 'Abel Experience CFW v3.0 Terminal Initialized.', type: 'system' },
        { text: 'Type "help" to see available commands.', type: 'info' }
    ]);
    // `input` holds the current value of the user's input field.
    const [input, setInput] = useState('');
    // `isProcessing` locks the input while the terminal is "typing".
    const [isProcessing, setIsProcessing] = useState(false);
    
    // A ref to the input field to auto-focus it.
    const inputRef = useRef(null);
    // A ref to the end of the output to auto-scroll.
    const endOfLinesRef = useRef(null);

    // --- EFFECTS ---
    // Automatically focus the input when the component loads or when processing finishes.
    useEffect(() => {
        inputRef.current?.focus();
    }, [isProcessing]);

    // Automatically scroll to the bottom whenever new lines are added.
    useEffect(() => {
        endOfLinesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lines]);

    // --- HELPER FUNCTIONS ---

    // Adds a new line or multiple lines to the terminal output.
    const addLines = (newLines) => {
        setLines(prev => [...prev, ...newLines]);
    };

    // The typewriter effect function.
    const typeLines = async (linesToType) => {
        setIsProcessing(true); // Lock input
        for (const line of linesToType) {
            let currentText = '';
            // Add a new empty line object to our state
            setLines(prev => [...prev, { text: '', type: line.type, isTyping: true }]);
            
            // Type out the line character by character
            for (let i = 0; i < line.text.length; i++) {
                currentText += line.text[i];
                // Update the *last* line in the state with the new character
                setLines(prev => {
                    const nextLines = [...prev];
                    nextLines[nextLines.length - 1].text = currentText;
                    return nextLines;
                });
                // Random delay for a more natural, glitchy typing feel
                await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 40));
            }
            // Mark the line as finished typing
            setLines(prev => {
                const nextLines = [...prev];
                nextLines[nextLines.length - 1].isTyping = false;
                return nextLines;
            });
        }
        setIsProcessing(false); // Unlock input
    };
    
    // Formats and displays a fetched Volume.
    const displayVolume = async (volumeData) => {
        let linesToDisplay = [];
        linesToDisplay.push({ text: `--- Loading Volume ${volumeData.volumeNumber}: ${volumeData.title} ---`, type: 'system' });
        linesToDisplay.push({ text: ` `, type: 'info' }); // Spacer
        
        // Add body lines, assigning a 'greentext' type to lines starting with '>'.
        volumeData.bodyLines.forEach(line => {
            linesToDisplay.push({
                text: line,
                type: line.startsWith('>') ? 'greentext' : 'info'
            });
        });

        // Add blessings and dream if they exist.
        if (volumeData.blessings && volumeData.blessings.length > 0) {
            linesToDisplay.push({ text: ` `, type: 'info' });
            linesToDisplay.push({ text: volumeData.blessingIntro, type: 'system' });
            volumeData.blessings.forEach(b => {
                linesToDisplay.push({ text: `${b.item} ${b.description}`, type: 'info' });
            });
        }
        if (volumeData.dream) {
            linesToDisplay.push({ text: ` `, type: 'info' });
            linesToDisplay.push({ text: volumeData.dream, type: 'system' });
        }
        
        await typeLines(linesToDisplay);
    };


    // --- COMMAND PROCESSING ---
    const processCommand = async (command) => {
        const [cmd, ...args] = command.trim().toLowerCase().split(' ');
        setIsProcessing(true); // Lock input immediately

        switch (cmd) {
            case 'help':
                await typeLines([
                    { text: 'Available commands:', type: 'system' },
                    { text: '> catalogue    - View all published volumes', type: 'info' },
                    { text: '> random       - View a random volume', type: 'info' },
                    { text: '> view [number]  - View a specific volume by number', type: 'info' },
                    { text: '> clear        - Clear the terminal screen', type: 'info' },
                ]);
                break;
            
            case 'clear':
                setLines([]);
                break;

            case 'catalogue':
                try {
                    const res = await api.get('/volumes/catalogue');
                    const catalogueLines = res.data.data.map(vol => ({
                        text: `Volume ${vol.volumeNumber}: ${vol.title}`,
                        type: 'info'
                    }));
                    catalogueLines.unshift({ text: '--- Published Volumes ---', type: 'system' });
                    await typeLines(catalogueLines);
                } catch (error) {
                    await typeLines([{ text: 'Error: Could not fetch volume catalogue.', type: 'error' }]);
                }
                break;

            case 'random':
                try {
                    const res = await api.get('/volumes/random');
                    await displayVolume(res.data.data);
                } catch (error) {
                    await typeLines([{ text: 'Error: Could not fetch random volume.', type: 'error' }]);
                }
                break;

            case 'view':
                if (!args[0] || isNaN(parseInt(args[0]))) {
                    await typeLines([{ text: 'Error: Please provide a valid volume number. Usage: view [number]', type: 'error' }]);
                    break;
                }
                try {
                    const res = await api.get(`/volumes/id/${args[0]}`);
                    await displayVolume(res.data.data);
                } catch (error) {
                    await typeLines([{ text: `Error: Volume ${args[0]} not found or is not published.`, type: 'error' }]);
                }
                break;

            default:
                if (command.trim() !== '') {
                    await typeLines([{ text: `Command not found: ${command}. Type 'help' for a list of commands.`, type: 'error' }]);
                }
                break;
        }
        setIsProcessing(false); // Unlock input when done
    };

    // This handles the user pressing Enter in the input field.
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isProcessing) {
            const command = input.trim();
            // Add the command the user typed to the output history.
            addLines([{ text: `> ${command}`, type: 'user' }]);
            // Process the command.
            processCommand(command);
            // Clear the input field.
            setInput('');
        }
    };
    
    // --- JSX RENDER ---
    return (
        <div className="w-full h-[95vh] p-2" onClick={() => inputRef.current?.focus()}>
            {/* Output area */}
            <div className="overflow-y-auto h-full">
                {lines.map((line, index) => {
                    const lineStyle = {
                        'system': 'text-teal-400',
                        'info': 'text-gray-300',
                        'error': 'text-red-500',
                        'greentext': 'text-green-500',
                        'user': 'text-white'
                    }[line.type] || 'text-gray-300';

                    return (
                        <div key={index} className="flex">
                            <pre className={`whitespace-pre-wrap ${lineStyle}`}>{line.text}</pre>
                            {/* Show a blinking cursor on the line currently being typed */}
                            {line.isTyping && <span className="blinking-cursor">▋</span>}
                        </div>
                    );
                })}
                {/* This empty div is a reference point to scroll to the bottom */}
                <div ref={endOfLinesRef} />
            </div>

            {/* Input area */}
            <div className="flex mt-2">
                <span className="text-white">&gt;</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isProcessing}
                    className="flex-grow bg-transparent text-white border-none focus:ring-0 focus:outline-none ml-2"
                    autoComplete="off"
                />
            </div>
        </div>
    );
};

export default Terminal;