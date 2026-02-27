import { useState } from 'react';
import './GNB.css';

export default function GNB({ activeTab, setActiveTab }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const tabs = [
        { id: 'word', label: 'Essential Words', kor: '필수 영단어 1000' },
        { id: 'pattern', label: 'Pattern Play', kor: '패턴 문장 놀이' },
        { id: 'quiz', label: 'Sentence Quiz', kor: '문장 조립 퀴즈' },
        { id: 'alphabet', label: 'Alphabet Writing', kor: '알파벳 쓰기' },
        { id: 'essential', label: 'Essential 500', kor: '필수 문장 500' }
    ];

    const handleTabClick = (id) => {
        setActiveTab(id);
        setIsMenuOpen(false); // Close menu on mobile after selecting
    };

    return (
        <nav className="gnb-nav">
            <div className="gnb-header-mobile">
                <div className="gnb-logo">
                    🍊 Daily Snap
                </div>
                <button
                    className={`hamburger-btn ${isMenuOpen ? 'open' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>
            </div>

            <div className={`gnb-container ${isMenuOpen ? 'show' : ''}`}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`gnb-item ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => handleTabClick(tab.id)}
                    >
                        <span className="gnb-label-en">{tab.label}</span>
                        <span className="gnb-label-ko">{tab.kor}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
