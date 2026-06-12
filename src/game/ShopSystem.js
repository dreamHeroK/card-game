import { CARD_DATA, IRONCLAD_CARD_POOL } from '../data/cards.js'
import { RELIC_DATA, COMMON_RELICS } from '../data/relics.js'

export function generateShop(playerDeck, playerRelics) {
  const deckIds = playerDeck.map(c => c.id)
  const availableCards = IRONCLAD_CARD_POOL.filter(id => {
    const count = deckIds.filter(d => d === id).length
    return count < 3
  })

  const RARITY_PRICE = { COMMON: 45, UNCOMMON: 68, RARE: 135 }
  const RARITY_SPREAD = { COMMON: 30, UNCOMMON: 25, RARE: 30 }

  const shuffledCards = [...availableCards].sort(() => Math.random() - 0.5)
  const shopCards = shuffledCards.slice(0, 4).map(id => {
    const cardData = CARD_DATA[id]
    const base = RARITY_PRICE[cardData?.rarity] ?? 50
    const spread = RARITY_SPREAD[cardData?.rarity] ?? 30
    return { cardData, price: base + Math.floor(Math.random() * spread), sold: false }
  })

  const availableRelics = COMMON_RELICS.filter(id => !playerRelics.includes(id))
  const shuffledRelics = [...availableRelics].sort(() => Math.random() - 0.5)
  const shopRelics = shuffledRelics.slice(0, 2).map(id => ({
    relicData: RELIC_DATA[id],
    price: 150 + Math.floor(Math.random() * 50),
    sold: false,
  }))

  return {
    cards: shopCards,
    relics: shopRelics,
    removePrice: 75,
  }
}
