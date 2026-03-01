import { useRef, useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import './AlphabetWriting.css';
import { LETTERS, STROKE_GUIDES, PRONUNCIATION_MAP } from '../data/strokeGuides';

export default function AlphabetWriting() {
    const canvasRef = useRef(null);
    const drawingTimeoutRef = useRef(null);
    const hasDrawnRef = useRef(false);
    const guideCanvasRef = useRef(null);
    const animationRef = useRef(null);

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
            // Use longer timeout since letters take multiple strokes
            drawingTimeoutRef.current = setTimeout(() => {
                recognizeDrawing();
                hasDrawnRef.current = false;
            }, 1500);
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
        return { offsetX: event.nativeEvent.offsetX, offsetY: event.nativeEvent.offsetY };
    };

    const clearCanvas = () => {
        if (drawingTimeoutRef.current) clearTimeout(drawingTimeoutRef.current);
        hasDrawnRef.current = false;
        setShowStamp(false);

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
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

    // Guide Canvas Animation Loop
    useEffect(() => {
        const gCanvas = guideCanvasRef.current;
        if (!gCanvas) return;

        gCanvas.width = 150;
        gCanvas.height = 150;
        const ctx = gCanvas.getContext('2d');
        const drawScale = 0.5;

        let step = 0;
        let isAnimating = true;

        const drawFrame = () => {
            if (!isAnimating) return;
            ctx.clearRect(0, 0, 150, 150);

            // Draw background letter
            ctx.font = '140px "Inter", sans-serif';
            ctx.fillStyle = '#e0e0e0';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(currentLetter, 75, 75 + 10);

            // Draw center dashed guide line
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.moveTo(0, 75);
            ctx.lineTo(150, 75);
            ctx.strokeStyle = '#cccccc';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);

            const guides = STROKE_GUIDES[currentLetter];
            if (guides && guides.length > 0) {
                const maxSteps = guides.length;
                const strokesToShow = step % (maxSteps + 2);

                for (let i = 0; i < Math.min(strokesToShow, maxSteps); i++) {
                    const guide = guides[i];
                    const gx = guide.x * drawScale;
                    const gy = guide.y * drawScale;

                    ctx.beginPath();
                    ctx.arc(gx, gy, 7, 0, Math.PI * 2);
                    ctx.fillStyle = i === strokesToShow - 1 ? '#FF7B54' : '#777';
                    ctx.fill();

                    ctx.font = 'bold 8px "Inter", sans-serif';
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(guide.text, gx, gy);

                    ctx.beginPath();
                    ctx.strokeStyle = i === strokesToShow - 1 ? '#FF7B54' : '#777';
                    ctx.lineWidth = 1.5;

                    const arrowLen = 7.5;
                    const offset = 9;
                    let startX = gx;
                    let startY = gy;
                    let endX = startX;
                    let endY = startY;

                    if (guide.dir === 'd') { startY += offset; endY = startY + arrowLen; }
                    else if (guide.dir === 'r') { startX += offset; endX = startX + arrowLen; }
                    else if (guide.dir === 'l') { startX -= offset; endX = startX - arrowLen; }
                    else if (guide.dir === 'dl') { startX -= offset; startY += offset; endX = startX - arrowLen; endY = startY + arrowLen; }
                    else if (guide.dir === 'dr') { startX += offset; startY += offset; endX = startX + arrowLen; endY = startY + arrowLen; }

                    if (startX !== gx || startY !== gy) {
                        ctx.moveTo(startX, startY);
                        ctx.lineTo(endX, endY);
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.fillStyle = i === strokesToShow - 1 ? '#FF7B54' : '#777';
                        ctx.arc(endX, endY, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }

                step++;
                animationRef.current = setTimeout(drawFrame, 800);
            }
        };

        drawFrame();

        return () => {
            isAnimating = false;
            if (animationRef.current) clearTimeout(animationRef.current);
        };
    }, [currentLetter]);

    return (
        <div className={`alphabet-container ${isFlashing ? 'flash-effect' : ''}`}>
            <div className="letter-header-title">
                — {currentLetter} —
            </div>

            <div className="alphabet-main-area">
                <div className="guide-box">
                    <div className="box-title">쓰는 순서</div>
                    <div className="guide-canvas-wrapper">
                        <canvas ref={guideCanvasRef} className="guide-canvas" />
                    </div>
                </div>

                <div className="interactive-box">
                    <div className={`canvas-wrapper ${isRecognizing ? 'recognizing' : ''}`}>
                        <canvas
                            ref={canvasRef}
                            className="drawing-board"
                            width={300}
                            height={300}
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
                </div>
            </div>

            <div className="alphabet-footer-card">
                <div className="progress-text">{currentLetterIndex + 1} / {LETTERS.length}</div>
                <div className="nav-buttons-row">
                    <button className="nav-action-btn" onClick={prevLetter}>이전 알파벳</button>
                    <button className="nav-action-btn primary" onClick={clearCanvas}>다시쓰기</button>
                    <button className="nav-action-btn" onClick={nextLetter}>다음 알파벳</button>
                </div>
            </div>
        </div>
    );
}
