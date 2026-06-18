import { CARD_DATA } from './data/cards.js'

const TYPE_COLOR  = { ATTACK: '#c83020', SKILL: '#1a6a88', POWER: '#6a1a98', STATUS: '#555' }
const TYPE_BANNER = { ATTACK: '#7a1800', SKILL: '#003f55', POWER: '#320060', STATUS: '#2a2a2a' }
const TYPE_LABEL  = { ATTACK: '攻击', SKILL: '技能', POWER: '能力', STATUS: '状态' }
const RARITY_ORDER = ['BASIC', 'STATUS', 'COMMON', 'UNCOMMON', 'RARE']
const RARITY_LABEL = { BASIC: '基础', STATUS: '状态', COMMON: '普通', UNCOMMON: '稀有', RARE: '传说' }
const RARITY_COLOR = { BASIC: '#888', STATUS: '#555', COMMON: '#aaa', UNCOMMON: '#4a90d9', RARE: '#d4a017' }

function CardTile({ card }) {
  const typeColor = TYPE_COLOR[card.type] || '#888'
  const bannerBg  = TYPE_BANNER[card.type] || '#333'
  return (
    <div style={{
      width: 120, background: '#1a1a1a', border: `2px solid ${typeColor}`,
      borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      fontFamily: 'sans-serif', fontSize: 11, color: '#eee',
    }}>
      <div style={{ background: typeColor, padding: '2px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', fontSize: 13 }}>{card.cost}</span>
        {card.upgraded && <span style={{ fontSize: 9, background: 'rgba(255,255,255,0.3)', borderRadius: 3, padding: '1px 3px' }}>+</span>}
        {card.innate && <span style={{ fontSize: 9, background: '#d4a017', color: '#000', borderRadius: 3, padding: '1px 3px' }}>固</span>}
        {card.exhaust && <span style={{ fontSize: 9, background: '#c83020', borderRadius: 3, padding: '1px 3px' }}>耗</span>}
      </div>
      <div style={{ height: 70, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={card.image} alt={card.name}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          onError={e => { e.target.replaceWith(Object.assign(document.createElement('div'), {
            textContent: '无图', style: 'color:#666;font-size:10px;text-align:center'
          })) }}
        />
      </div>
      <div style={{ background: bannerBg, padding: '2px 4px', borderTop: `1px solid ${typeColor}` }}>
        <div style={{ fontWeight: 'bold', fontSize: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.name}</div>
        <div style={{ fontSize: 9, color: typeColor }}>{TYPE_LABEL[card.type] || card.type}</div>
      </div>
      <div style={{ padding: '4px', fontSize: 9, color: '#bbb', lineHeight: 1.3, flexGrow: 1 }}>
        {card.description}
      </div>
    </div>
  )
}

export default function CardGallery() {
  const allCards = Object.values(CARD_DATA)

  const grouped = {}
  for (const r of RARITY_ORDER) {
    grouped[r] = allCards.filter(c => c.rarity === r)
  }

  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh', padding: 16, fontFamily: 'sans-serif', color: '#eee' }}>
      <h1 style={{ fontSize: 20, marginBottom: 4, color: '#d4a017' }}>卡牌全览 — 铁甲人</h1>
      <p style={{ color: '#888', fontSize: 12, marginBottom: 16 }}>共 {allCards.length} 张（含升级版）</p>

      {RARITY_ORDER.map(rarity => {
        const cards = grouped[rarity]
        if (!cards?.length) return null
        return (
          <section key={rarity} style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 14, color: RARITY_COLOR[rarity], borderBottom: `1px solid ${RARITY_COLOR[rarity]}`, paddingBottom: 4, marginBottom: 10 }}>
              {RARITY_LABEL[rarity]}（{cards.length} 张）
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {cards.map(card => <CardTile key={card.id} card={card} />)}
            </div>
          </section>
        )
      })}
    </div>
  )
}
