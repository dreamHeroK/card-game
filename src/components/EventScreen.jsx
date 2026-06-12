import './EventScreen.css'

export default function EventScreen({ state, dispatch }) {
  const { event } = state
  if (!event) return null

  return (
    <div className="event-screen">
      <div className="event-image-panel">
        <img
          className="event-image"
          src={event.image}
          alt={event.title}
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>

      <div className="event-content-panel">
        <h1 className="event-title">{event.title}</h1>
        <p className="event-body">{event.body}</p>

        {event.result === null ? (
          <div className="event-choices">
            {event.choices.map((choice, i) => (
              <button
                key={i}
                className="event-choice-btn"
                onClick={() => dispatch({ type: 'CHOOSE_EVENT', payload: { choiceIndex: i } })}
              >
                {choice.text}
              </button>
            ))}
          </div>
        ) : (
          <div className="event-result-area">
            <div className="event-result-text">{event.result}</div>
            <button
              className="event-continue-btn"
              onClick={() => dispatch({ type: 'LEAVE_EVENT' })}
            >
              继续
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
