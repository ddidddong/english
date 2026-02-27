import { useRef, useState, useEffect } from 'react';
import './AlphabetWriting.css';

// Pre-define some target letters for tracing
const LETTERS = ['A', 'a', 'B', 'b', 'C', 'c', 'D', 'd', 'E', 'e'];

export default function AlphabetWriting() {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [isFlashing, setIsFlashing] = useState(false);

    const currentLetter = LETTERS[currentLetterIndex];

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = getCoordinates(nativeEvent);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = getCoordinates(nativeEvent);
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const endDrawing = () => {
        setIsDrawing(false);
        const ctx = canvasRef.current.getContext('2d');
        ctx.closePath();
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
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGuideLetter(ctx, canvas.width, canvas.height);
        }
    };

    const nextLetter = () => {
        setCurrentLetterIndex((prev) => (prev + 1) % LETTERS.length);
    };

    const prevLetter = () => {
        setCurrentLetterIndex((prev) => (prev === 0 ? LETTERS.length - 1 : prev - 1));
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
        // Play TTS sound. Convert to uppercase so the letter name is read clearly (e.g., 'a' -> 'A' -> "Ay")
        const utterance = new SpeechSynthesisUtterance(currentLetter.toUpperCase());
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);

        // Trigger flash animation
        setIsFlashing(true);
        setTimeout(() => {
            setIsFlashing(false);
        }, 500); // Flash duration
    };

    // Redraw when letter changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            // Set fixed dimensions that work well on mobile/desktop
            canvas.width = 300;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');
            clearCanvas();

            // Prevent scrolling when touching canvas
            const preventScroll = (e) => e.preventDefault();
            canvas.addEventListener('touchstart', preventScroll, { passive: false });
            canvas.addEventListener('touchmove', preventScroll, { passive: false });

            return () => {
                canvas.removeEventListener('touchstart', preventScroll);
                canvas.removeEventListener('touchmove', preventScroll);
            }
        }
    }, [currentLetter]);

    return (
        <div className={`alphabet-container ${isFlashing ? 'flash-effect' : ''}`}>
            <div className="controls-top">
                <button onClick={prevLetter} className="nav-btn">◀</button>
                <div className="letter-indicator">Letter: {currentLetter}</div>
                <button onClick={nextLetter} className="nav-btn">▶</button>
            </div>

            <div className="canvas-wrapper">
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
            </div>

            <div className="controls-bottom">
                <button className="done-btn" onClick={handleDone}>
                    완성 (Done)
                </button>
                <button className="clear-btn" onClick={clearCanvas}>
                    지우기 (Clear)
                </button>
            </div>
        </div>
    );
}
