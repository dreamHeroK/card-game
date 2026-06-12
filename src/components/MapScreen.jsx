import './MapScreen.css'
import { getNodeImage } from '../utils/imageLoader.js'
import RelicIcon from './RelicIcon.jsx'

const NODE_LABELS = {
  BATTLE: '战斗', ELITE: '精英', REST: '篝火', SHOP: '商店',
  EVENT: '未知', BOSS: '首领', TREASURE: '宝箱',
}

const ANCHOR_LABELS = { 4: '精英锚点', 8: '商店锚点' }

const COL_SPACING = 132
const X_OFFSET = 50

export default function MapScreen({ state, dispatch }) {
  const { player, map, floor } = state
  if (!map) return null

  const mapWidth = map.mapWidth || 1580
  const mapHeight = map.mapHeight || 700
  const anchorCols = map.anchorCols || []

  function handleNodeClick(node) {
    if (!map.availableNodeIds.includes(node.id)) return
    dispatch({ type: 'SELECT_NODE', payload: { nodeId: node.id } })
  }

  return (
    <div className="map-screen">
      {/* Header */}
      <div className="map-header">
        <div className="map-header-left">
          <span className="act-title">第一幕 — 荣耀大厅</span>
          <span className="floor-label">第 {floor} 层</span>
        </div>
        <div className="map-header-center">
          <div className="relic-row">
            {player.relics.map(relicId => (
              <RelicIcon key={relicId} relicId={relicId} size={36} />
            ))}
          </div>
        </div>
        <div className="map-header-right">
          <div className="stat-chip">
            <img src="/assets/ui-top-bar/top_bar_heart.png" alt="HP" width={16} onError={e => { e.target.style.display = 'none' }} />
            {player.hp}/{player.maxHp}
          </div>
          <div className="stat-chip gold">
            <img src="/assets/ui-top-bar/top_bar_gold.png" alt="Gold" width={16} onError={e => { e.target.style.display = 'none' }} />
            {player.gold}
          </div>
          <div className="stat-chip">
            <img src="/assets/ui-top-bar/top_bar_deck.png" alt="Deck" width={16} onError={e => { e.target.style.display = 'none' }} />
            {player.deck.length} 张牌
          </div>
        </div>
      </div>

      {/* Map canvas */}
      <div className="map-container">
        <div className="map-scroll-inner" style={{ width: mapWidth, height: mapHeight }}>

          <svg
            className="map-paths-svg"
            width={mapWidth}
            height={mapHeight}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
          >
            <defs>
              {/* Anchor column gradient */}
              <linearGradient id="anchorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(160,100,255,0)" />
                <stop offset="30%" stopColor="rgba(160,100,255,0.22)" />
                <stop offset="70%" stopColor="rgba(160,100,255,0.22)" />
                <stop offset="100%" stopColor="rgba(160,100,255,0)" />
              </linearGradient>

              {/* Glow filter for available paths */}
              <filter id="availableGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Soft glow filter for completed paths */}
              <filter id="completedGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Anchor column glow bands */}
            {anchorCols.filter(c => c > 0 && c < 11).map(col => {
              const cx = col * COL_SPACING + X_OFFSET + 26
              return (
                <rect
                  key={`anchor-band-${col}`}
                  x={cx - 28} y={0}
                  width={56} height={mapHeight}
                  fill="url(#anchorGrad)"
                />
              )
            })}

            {/* Pass 1 – Locked & Completed paths (rendered behind available) */}
            {map.paths.map((path, i) => {
              const fromNode = map.nodes.find(n => n.id === path.from)
              const toNode = map.nodes.find(n => n.id === path.to)
              if (!fromNode || !toNode) return null

              const isAvailable = !!map.currentNodeId
                && fromNode.id === map.currentNodeId
                && map.availableNodeIds.includes(toNode.id)
              if (isAvailable) return null

              const isCompleted = fromNode.visited && toNode.visited
              const isSkip = toNode.col - fromNode.col > 1
              const x1 = fromNode.x + 26, y1 = fromNode.y + 26
              const x2 = toNode.x + 26, y2 = toNode.y + 26

              if (isCompleted) {
                return (
                  <line
                    key={`c-${i}`}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="#f4c842"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    opacity={0.82}
                    filter="url(#completedGlow)"
                  />
                )
              }

              return (
                <line
                  key={`l-${i}`}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={isSkip ? 'rgba(140,90,220,0.3)' : '#18183a'}
                  strokeWidth={1.5}
                  strokeDasharray={isSkip ? '3,5' : '5,4'}
                  strokeLinecap="round"
                  opacity={isSkip ? 0.6 : 0.5}
                />
              )
            })}

            {/* Pass 2 – Available paths (rendered on top, with glow) */}
            {map.paths.map((path, i) => {
              const fromNode = map.nodes.find(n => n.id === path.from)
              const toNode = map.nodes.find(n => n.id === path.to)
              if (!fromNode || !toNode) return null

              const isAvailable = !!map.currentNodeId
                && fromNode.id === map.currentNodeId
                && map.availableNodeIds.includes(toNode.id)
              if (!isAvailable) return null

              const x1 = fromNode.x + 26, y1 = fromNode.y + 26
              const x2 = toNode.x + 26, y2 = toNode.y + 26

              return (
                <g key={`a-${i}`}>
                  {/* Wide glow halo */}
                  <line
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="#00e8ff"
                    strokeWidth={10}
                    strokeLinecap="round"
                    className="path-available-glow"
                  />
                  {/* Core line */}
                  <line
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="#00e8ff"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    filter="url(#availableGlow)"
                    className="path-available-main"
                  />
                </g>
              )
            })}
          </svg>

          {/* Anchor column labels */}
          {anchorCols.filter(c => ANCHOR_LABELS[c]).map(col => (
            <div
              key={`anchor-label-${col}`}
              className="anchor-col-label"
              style={{ left: col * COL_SPACING + X_OFFSET - 16, width: 84 }}
            >
              {ANCHOR_LABELS[col]}
            </div>
          ))}

          {/* Nodes */}
          {map.nodes.map(node => {
            const isAvailable = map.availableNodeIds.includes(node.id)
            const isCurrent = node.id === map.currentNodeId
            const imgSrc = getNodeImage(node.type)
            const size = node.type === 'BOSS' ? 64 : node.isAnchor ? 54 : 48

            return (
              <div
                key={node.id}
                className={[
                  'map-node',
                  `map-node-${node.type.toLowerCase()}`,
                  node.isAnchor ? 'map-node-anchor' : '',
                  isAvailable ? 'available' : '',
                  node.visited ? 'visited' : '',
                  isCurrent ? 'current' : '',
                ].filter(Boolean).join(' ')}
                style={{ left: node.x, top: node.y, width: size, height: size }}
                onClick={() => handleNodeClick(node)}
                title={`${NODE_LABELS[node.type] || node.type}${node.isAnchor ? ' [锚点]' : ''}  (第${node.col + 1}列)`}
              >
                <img
                  src={imgSrc}
                  alt={node.type}
                  width={size}
                  height={size}
                  onError={e => { e.target.style.display = 'none' }}
                />
                {isCurrent && (
                  <img
                    className="map-marker"
                    src="/assets/ui-map-nodes/map_marker_ironclad.png"
                    alt="当前位置"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                )}
                {isAvailable && <div className="node-available-ring" />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer: deck preview */}
      <div className="map-footer">
        <div className="deck-summary">
          牌组（{player.deck.length}张）：
          {player.deck.slice(0, 8).map(card => (
            <span key={card.instanceId} className="deck-mini-card" title={card.description}>
              {card.name}{card.upgraded ? '+' : ''}
            </span>
          ))}
          {player.deck.length > 8 && <span className="deck-more">+{player.deck.length - 8}张</span>}
        </div>
      </div>
    </div>
  )
}
