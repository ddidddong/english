import { useRef, useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import './AlphabetWriting.css';

// Pre-define some target letters for tracing
const LETTERS = ['A', 'a', 'B', 'b', 'C', 'c', 'D', 'd', 'E', 'e'];

const PRONUNCIATION_MAP = {
    'A': 'ay', 'a': 'ay',
    'B': 'bee', 'b': 'bee',
    'C': 'see', 'c': 'see',
    'D': 'dee', 'd': 'dee',
    'E': 'ee', 'e': 'ee'
};

export default function AlphabetWriting() {
    const canvasRef = useRef(null);
    const drawingTimeoutRef = useRef(null);
    const hasDrawnRef = useRef(false);
    const hitMapRef = useRef(null);

    const [mode, setMode] = useState('tracing'); // 'tracing' | 'freehand'
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [isFlashing, setIsFlashing] = useState(false);
    const [showStamp, setShowStamp] = useState(false);
    const [isRecognizing, setIsRecognizing] = useState(false);

    const currentLetter = LETTERS[currentLetterIndex];

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = getCoordinates(nativeEvent);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
        if (drawingTimeoutRef.current) {
            clearTimeout(drawingTimeoutRef.current);
        }
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        hasDrawnRef.current = true;

        const { offsetX, offsetY } = getCoordinates(nativeEvent);
        const ctx = canvasRef.current.getContext('2d');

        // Tracing Validation
        if (mode === 'tracing' && hitMapRef.current) {
            const x = Math.floor(offsetX);
            const y = Math.floor(offsetY);
            // Ensure within bounds
            if (x >= 0 && x < 300 && y >= 0 && y < 300) {
                const isHit = hitMapRef.current[y * 300 + x];
                if (!isHit) {
                    ctx.strokeStyle = '#ff3b30'; // Red for error
                    if (navigator.vibrate) navigator.vibrate(50);
                } else {
                    ctx.strokeStyle = '#FF7B54'; // Back to normal
                }
            }
        }

        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const endDrawing = () => {
        setIsDrawing(false);
        const ctx = canvasRef.current.getContext('2d');
        ctx.closePath();
        ctx.strokeStyle = '#FF7B54'; // Reset stroke color

        if (hasDrawnRef.current) {
            if (drawingTimeoutRef.current) {
                clearTimeout(drawingTimeoutRef.current);
            }
            // Use longer timeout for freehand since letters take multiple strokes
            const timeoutDuration = mode === 'freehand' ? 1500 : 450;
            drawingTimeoutRef.current = setTimeout(() => {
                if (mode === 'freehand') {
                    recognizeDrawing();
                } else {
                    handleDone();
                }
                hasDrawnRef.current = false;
            }, timeoutDuration);
        }
    };

    const recognizeDrawing = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setIsRecognizing(true);
        try {
            const dataUrl = canvas.toDataURL('image/png');
            const result = await Tesseract.recognize(dataUrl, 'eng', {
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
            });

            const recognizedText = result.data.text.trim();
            if (recognizedText.toLowerCase().includes(currentLetter.toLowerCase())) {
                setShowStamp(true);
                handleDone();
                setTimeout(() => setShowStamp(false), 2000);
            } else {
                // If incorrect, just clear and let the user try again
                if (navigator.vibrate) navigator.vibrate([100, 100, 100]);
                clearCanvas();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsRecognizing(false);
        }
    };

    const getCoordinates = (event) => {
        if (event.touches) { // touch events
            const bcr = event.target.getBoundingClientRect();
            const x = event.targetTouches[0].clientX - bcr.x;
            const y = event.targetTouches[0].clientY - bcr.y;
            return { offsetX: x, offsetY: y };
        }
        // mouse events
        return { offsetX: event.offsetX, offsetY: event.offsetY };
    };

    const clearCanvas = () => {
        if (drawingTimeoutRef.current) clearTimeout(drawingTimeoutRef.current);
        hasDrawnRef.current = false;
        setShowStamp(false);

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (mode === 'tracing') {
                drawGuideLetter(ctx, canvas.width, canvas.height);
            }
        }
    };

    const nextLetter = () => {
        if (drawingTimeoutRef.current) clearTimeout(drawingTimeoutRef.current);
        hasDrawnRef.current = false;
        setCurrentLetterIndex((prev) => (prev + 1) % LETTERS.length);
    };

    const prevLetter = () => {
        if (drawingTimeoutRef.current) clearTimeout(drawingTimeoutRef.current);
        hasDrawnRef.current = false;
        setCurrentLetterIndex((prev) => (prev === 0 ? LETTERS.length - 1 : prev - 1));
    };

    const generateHitMap = () => {
        const w = 300;
        const h = 300;
        const offCanvas = document.createElement('canvas');
        offCanvas.width = w;
        offCanvas.height = h;
        const ctx = offCanvas.getContext('2d');

        ctx.font = '280px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw very thick to allow sloppy tracing
        ctx.lineWidth = 60;
        ctx.strokeStyle = 'black';
        ctx.strokeText(currentLetter, w / 2, h / 2 + 20);
        ctx.fillStyle = 'black';
        ctx.fillText(currentLetter, w / 2, h / 2 + 20);

        const imgData = ctx.getImageData(0, 0, w, h).data;
        const map = new Uint8Array(w * h);
        for (let i = 0; i < w * h; i++) {
            // Check alpha channel
            map[i] = imgData[i * 4 + 3] > 10 ? 1 : 0;
        }
        hitMapRef.current = map;
    };

    const drawGuideLetter = (ctx, w, h) => {
        // Draw background guide letter
        ctx.font = '280px "Inter", sans-serif';
        ctx.fillStyle = '#e0e0e0';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(currentLetter, w / 2, h / 2 + 20);

        // Draw guide lines
        ctx.beginPath();
        ctx.setLineDash([10, 10]);
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);

        // Reset stroke for drawing
        ctx.strokeStyle = '#FF7B54'; /* primary color */
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    };

    const handleDone = () => {
        // Play TTS sound using the phonetic map so it doesn't say "Capital A"
        const textToRead = PRONUNCIATION_MAP[currentLetter] || currentLetter;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);

        // Trigger flash animation
        setIsFlashing(true);
        setTimeout(() => {
            setIsFlashing(false);
        }, 500); // Flash duration
    };

    // Redraw when letter or mode changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = 300;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');

            // Set base stroke styles
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 15;
            ctx.strokeStyle = '#FF7B54';

            clearCanvas();
            if (mode === 'tracing') {
                generateHitMap();
            }

            // Prevent scrolling when touching canvas
            const preventScroll = (e) => e.preventDefault();
            canvas.addEventListener('touchstart', preventScroll, { passive: false });
            canvas.addEventListener('touchmove', preventScroll, { passive: false });

            return () => {
                canvas.removeEventListener('touchstart', preventScroll);
                canvas.removeEventListener('touchmove', preventScroll);
            }
        }
    }, [currentLetter, mode]);

    return (
        <div className={`alphabet-container ${isFlashing ? 'flash-effect' : ''}`}>
            <div className="mode-toggle">
                <button
                    className={`toggle-btn ${mode === 'tracing' ? 'active' : ''}`}
                    onClick={() => setMode('tracing')}
                >
                    따라 쓰기 (Tracing)
                </button>
                <button
                    className={`toggle-btn ${mode === 'freehand' ? 'active' : ''}`}
                    onClick={() => setMode('freehand')}
                >
                    혼자 쓰기 (Free Hand)
                </button>
            </div>

            <div className="controls-top">
                <button onClick={prevLetter} className="nav-btn">◀</button>
                <div className="letter-indicator">Letter: {currentLetter}</div>
                <button onClick={nextLetter} className="nav-btn">▶</button>
            </div>

            <div className={`canvas-wrapper ${isRecognizing ? 'recognizing' : ''}`}>
                <canvas
                    ref={canvasRef}
                    className="drawing-board"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseLeave={endDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={endDrawing}
                />
                {showStamp && (
                    <div className="stamp-overlay">
                        <div className="stamp-text">참 잘했어요!</div>
                    </div>
                )}
                {isRecognizing && (
                    <div className="recognizing-overlay">
                        <span className="loader-text">AI 확인 중...</span>
                    </div>
                )}
            </div>

            <div className="controls-bottom">
                <button className="clear-btn" onClick={clearCanvas}>
                    지우기 (Clear)
                </button>
            </div>
        </div>
    );
}
