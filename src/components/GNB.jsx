import './GNB.css';

export default function GNB({ activeTab, setActiveTab }) {
    const tabs = [
        { id: 'word', label: 'Word of the Day', kor: '오늘의 단어' },
        { id: 'pattern', label: 'Pattern Play', kor: '패턴 문장 놀이' },
        { id: 'quiz', label: 'Sentence Quiz', kor: '문장 조립 퀴즈' },
        { id: 'alphabet', label: 'Alphabet Writing', kor: '알파벳 쓰기' }
    ];

    return (
        <nav className="gnb-nav">
            <div className="gnb-container">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`gnb-item ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="gnb-label-en">{tab.label}</span>
                        <span className="gnb-label-ko">{tab.kor}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
