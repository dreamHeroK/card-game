// 图片资源加载器 - 使用SVG占位符降级处理

/**
 * 生成SVG占位符图片
 * @param {string} name - 名称
 * @param {string} color - 颜色
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @returns {string} SVG data URI
 */
const createPlaceholder = (name, color = '#667eea', width = 200, height = 280) => {
  const initial = name.charAt(0).toUpperCase();
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}" opacity="0.8"/>
      <rect x="5" y="5" width="${width-10}" height="${height-10}" fill="none" stroke="#fff" stroke-width="2"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
            font-size="${Math.min(width, height) * 0.3}" fill="#fff" font-weight="bold">${initial}</text>
    </svg>
  `)}`;
};

// 卡牌图片 - 返回SVG占位符
export const getCardImage = (cardId) => {
  return createPlaceholder(cardId, '#667eea', 200, 280);
};

// 怪物图片 - 返回SVG占位符
export const getMonsterImage = (monsterId) => {
  return createPlaceholder(monsterId, '#ff4444', 150, 150);
};

// 遗物图片 - 返回SVG占位符
export const getRelicImage = (relicId) => {
  return createPlaceholder(relicId, '#ffaa00', 100, 100);
};

// 节点图标图片 - 返回null，使用emoji
export const getNodeImage = (nodeType) => {
  return null; // 使用emoji显示
};

// 预加载图片（占位符不需要预加载）
export const preloadImage = (url) => {
  return Promise.resolve();
};

// 批量预加载图片
export const preloadImages = async (urls) => {
  // 占位符不需要预加载
  return Promise.resolve();
};
