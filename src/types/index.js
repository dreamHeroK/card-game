export const SCREENS = {
  MAIN_MENU: 'MAIN_MENU', MAP: 'MAP', BATTLE: 'BATTLE',
  BATTLE_REWARD: 'BATTLE_REWARD', SHOP: 'SHOP', REST: 'REST',
  EVENT: 'EVENT', GAME_OVER: 'GAME_OVER', VICTORY: 'VICTORY',
}

export const NODE_TYPES = {
  BATTLE: 'BATTLE', ELITE: 'ELITE', REST: 'REST', SHOP: 'SHOP',
  EVENT: 'EVENT', BOSS: 'BOSS', TREASURE: 'TREASURE',
}

export const STATUS = {
  // ── 已有状态 ──────────────────────────────────────────────────────────────
  VULNERABLE: 'VULNERABLE', WEAK: 'WEAK', FRAIL: 'FRAIL',
  STRENGTH: 'STRENGTH', DEXTERITY: 'DEXTERITY', RITUAL: 'RITUAL',
  POISON: 'POISON', ARTIFACT: 'ARTIFACT', FLEX_STRENGTH: 'FLEX_STRENGTH',
  METALLICIZE: 'METALLICIZE', FEEL_NO_PAIN: 'FEEL_NO_PAIN',
  DEMON_FORM: 'DEMON_FORM', BARRICADE: 'BARRICADE',
  DOUBLE_TAP: 'DOUBLE_TAP', AMPLIFY: 'AMPLIFY',
  // ── STS2 新增状态效果 ─────────────────────────────────────────────────────
  THORNS: 'THORNS',         // 荆棘：被攻击时对攻击者造成伤害
  VIGOR: 'VIGOR',           // 活力：下一张攻击牌伤害增加，打出后消耗
  REGEN: 'REGEN',           // 再生：每回合开始回复生命，每回合数值-1
  BUFFER: 'BUFFER',         // 缓冲：阻止下一次生命损失，消耗1层
  INTANGIBLE: 'INTANGIBLE', // 无实体：本回合所有伤害降为1点，每回合-1
  DOOM: 'DOOM',             // 灾厄：敌方回合结束时若灾厄≥HP则死亡
  // ── STS2 行动限制（减益）────────────────────────────────────────────────
  CONFUSED: 'CONFUSED',     // 混乱：抽牌时费用随机0-3
  SMOGGY: 'SMOGGY',         // 烟雾弥漫：每回合只能打出1张技能牌
  RINGING: 'RINGING',       // 昏眩：本回合只能打出1张牌
  SLOTH: 'SLOTH',           // 懒惰：每回合最多打出3张牌
  TANGLED: 'TANGLED',       // 缠结：本回合攻击牌费用+1
}

export const INTENT_TYPES = {
  ATTACK: 'ATTACK', DEFEND: 'DEFEND', BUFF: 'BUFF', DEBUFF: 'DEBUFF', SLEEP: 'SLEEP',
}
