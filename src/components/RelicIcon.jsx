import { useRef, useState } from 'react'
import { RELIC_DATA } from '../data/relics.js'
import './RelicIcon.css'

const RARITY_COLOR = {
  STARTER: '#e0c878', COMMON: '#c0c0c0', UNCOMMON: '#7ab8f5',
  RARE: '#f5c860', BOSS: '#e8b4f8', SHOP: '#60d8a0', EVENT: '#f0a050',
}

const RARITY_LABEL = {
  STARTER: '起始', COMMON: '普通', UNCOMMON: '少见',
  RARE: '稀有', BOSS: '首领', SHOP: '商店', EVENT: '事件',
}

export default function RelicIcon({ relicId, size = 36 }) {
  const relic = RELIC_DATA[relicId]
  const wrapRef = useRef(null)
  const [flipDown, setFlipDown] = useState(false)

  if (!relic) return null

  function handleMouseEnter() {
    if (wrapRef.current) {
      const rect = wrapRef.current.getBoundingClientRect()
      // flip tooltip below the icon if there's not enough room above
      setFlipDown(rect.top < 150)
    }
  }

  const rarityColor = RARITY_COLOR[relic.rarity] || '#f0e0c0'

  return (
    <div
      className="relic-icon-wrap"
      ref={wrapRef}
      onMouseEnter={handleMouseEnter}
    >
      <img
        className="relic-icon"
        src={relic.image}
        alt={relic.name}
        style={{ width: size, height: size }}
        onError={e => { e.target.style.opacity = '0.3' }}
      />

      <div className={`relic-tooltip${flipDown ? ' relic-tooltip-below' : ''}`}>
        <div className="rt-head">
          <img
            className="rt-img"
            src={relic.image}
            alt={relic.name}
            onError={e => { e.target.style.opacity = '0.3' }}
          />
          <div>
            <div className="rt-name" style={{ color: rarityColor }}>{relic.name}</div>
            <div className="rt-rarity" style={{ color: rarityColor, opacity: 0.6 }}>
              {RARITY_LABEL[relic.rarity] || relic.rarity}
            </div>
          </div>
        </div>
        <div className="rt-divider" />
        <div className="rt-desc">{relic.description}</div>
      </div>
    </div>
  )
}
