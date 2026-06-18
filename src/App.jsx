import { useReducer, useEffect } from 'react'
import { gameReducer, createInitialState } from './game/GameState.js'
import BattleScreen from './components/BattleScreen.jsx'
import MapScreen from './components/MapScreen.jsx'
import BattleRewardScreen from './components/BattleRewardScreen.jsx'
import ShopScreen from './components/ShopScreen.jsx'
import RestScreen from './components/RestScreen.jsx'
import EventScreen from './components/EventScreen.jsx'
import CardGallery from './CardGallery.jsx'
import './App.css'

function MainMenu({ dispatch }) {
  return (
    <div className="app-main-menu">
      <div className="menu-bg">
        <img
          className="menu-bg-image"
          src="/assets/renders/main_menu_bg.png"
          alt=""
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>
      <img
        className="menu-char"
        src="/assets/ui-characters/select_ironclad.png"
        alt="铁甲人"
        onError={e => { e.target.src = '/assets/renders/ironclad.png' }}
      />
      <div className="menu-content">
        <img
          className="menu-logo"
          src="/assets/renders/sts2_logo_static.png"
          alt="STS2"
          onError={e => { e.target.style.display = 'none' }}
        />
        <div className="menu-title">屠龙勇者：尖塔 2</div>
        <div className="menu-subtitle">Demo — 铁甲人 · 第一幕</div>
        <button
          className="menu-start-btn"
          onClick={() => dispatch({ type: 'START_GAME' })}
        >
          开始新游戏
        </button>
      </div>
    </div>
  )
}

function GameOver({ dispatch, state }) {
  return (
    <div className="screen-overlay screen-game-over">
      <div className="overlay-title-gameover">你已倒下</div>
      <div className="overlay-stats">
        到达第 {state.floor} 层<br />
        牌组共 {state.player.deck.length} 张牌<br />
        剩余金币 {state.player.gold}
      </div>
      <button
        className="overlay-btn overlay-btn-gameover"
        onClick={() => dispatch({ type: 'START_GAME' })}
      >
        重新开始
      </button>
    </div>
  )
}

function Victory({ dispatch, state }) {
  return (
    <div className="screen-overlay screen-victory">
      <div className="overlay-title-victory">胜利！</div>
      <div className="overlay-stats">
        你击败了仪式兽，完成了第一幕！<br />
        最终生命值：{state.player.hp} / {state.player.maxHp}<br />
        牌组共 {state.player.deck.length} 张牌<br />
        金币：{state.player.gold}
      </div>
      <button
        className="overlay-btn overlay-btn-victory"
        onClick={() => dispatch({ type: 'START_GAME' })}
      >
        再来一局
      </button>
    </div>
  )
}

export default function App() {
  if (new URLSearchParams(window.location.search).get('gallery') === '1') {
    return <CardGallery />
  }

  const [state, dispatch] = useReducer(gameReducer, null, createInitialState)

  useEffect(() => {
    if (state.battle?.turn === 'ENEMY') {
      const timer = setTimeout(() => dispatch({ type: 'ENEMY_TURN' }), 900)
      return () => clearTimeout(timer)
    }
  }, [state.battle?.turn, state.battle?.turnNumber])

  const { screen } = state

  if (screen === 'MAIN_MENU') return <MainMenu dispatch={dispatch} />
  if (screen === 'MAP') return <MapScreen state={state} dispatch={dispatch} />
  if (screen === 'BATTLE') return <BattleScreen state={state} dispatch={dispatch} />
  if (screen === 'BATTLE_REWARD') return <BattleRewardScreen state={state} dispatch={dispatch} />
  if (screen === 'SHOP') return <ShopScreen state={state} dispatch={dispatch} />
  if (screen === 'REST') return <RestScreen state={state} dispatch={dispatch} />
  if (screen === 'EVENT') return <EventScreen state={state} dispatch={dispatch} />
  if (screen === 'GAME_OVER') return <GameOver dispatch={dispatch} state={state} />
  if (screen === 'VICTORY') return <Victory dispatch={dispatch} state={state} />

  return null
}
