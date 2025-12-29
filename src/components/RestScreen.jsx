import './RestScreen.css';

export default function RestScreen({ player, onRest, onUpgrade, onLeave }) {
  return (
    <div className="rest-screen">
      <div className="rest-header">
        <h1>休息处</h1>
        <div className="player-info">
          <div>生命: {player.hp}/{player.maxHp}</div>
          <div>金币: {player.gold}</div>
        </div>
        <button onClick={onLeave}>离开</button>
      </div>

      <div className="rest-options">
        <div className="rest-option">
          <h2>休息</h2>
          <p>恢复所有生命值</p>
          <button onClick={onRest}>休息</button>
        </div>

        <div className="rest-option">
          <h2>升级卡牌</h2>
          <p>选择一张卡牌进行升级</p>
          <div className="deck-list">
            {player.deck.map((card, index) => (
              <div key={index} className="deck-card">
                <span>{card.name} {card.upgraded ? '(已升级)' : ''}</span>
                {!card.upgraded && (
                  <button onClick={() => onUpgrade(index)}>升级</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

