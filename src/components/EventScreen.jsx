import { useState } from 'react';
import './EventScreen.css';

export default function EventScreen({ event, player, onOptionSelect, onLeave }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [resultMessage, setResultMessage] = useState(null);

  if (!event) return null;

  const handleOptionClick = (option, index) => {
    setSelectedOption(index);
    
    // 执行选项效果
    const result = option.effect(player, {});
    
    if (result) {
      setResultMessage(result.message || '');
      
      // 如果返回了需要特殊处理的结果
      if (result.battle) {
        // 延迟一下显示消息，然后触发战斗
        setTimeout(() => {
          onOptionSelect(option, result);
        }, 1000);
      } else if (result.upgrade) {
        // 触发升级界面
        setTimeout(() => {
          onOptionSelect(option, result);
        }, 1000);
      } else if (result.chooseCard) {
        // 触发选择卡牌界面
        setTimeout(() => {
          onOptionSelect(option, result);
        }, 1000);
      } else {
        // 普通选项，直接关闭
        setTimeout(() => {
          onOptionSelect(option, result);
        }, 1500);
      }
    }
  };

  return (
    <div className="event-screen">
      <div className="event-container">
        <div className="event-header">
          <h2 className="event-name">{event.name}</h2>
        </div>
        
        <div className="event-description">
          {event.description}
        </div>

        {resultMessage && (
          <div className={`event-result ${resultMessage.includes('不足') || resultMessage.includes('错误') ? 'error' : ''}`}>
            {resultMessage}
          </div>
        )}

        <div className="event-options">
          {event.options.map((option, index) => (
            <button
              key={index}
              className={`event-option ${selectedOption === index ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option, index)}
              disabled={selectedOption !== null}
            >
              {option.text}
            </button>
          ))}
        </div>

        {selectedOption === null && (
          <button className="event-leave" onClick={onLeave}>
            离开
          </button>
        )}
      </div>
    </div>
  );
}

