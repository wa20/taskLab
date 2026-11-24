

type ISummaryCardsProps = {
    total: number,
    inProgress: number,
    done: number
}

const SummaryCards = (props: ISummaryCardsProps )  => {
  return (
    <>
        <div className="summary-card">
          <span className="summary-label">Total Tasks:</span>
          <strong className="summary-value">{props.total}</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">In progress:</span>
          <strong className="summary-value">{props.inProgress}</strong>
          </div>
        <div className="summary-card">
          <span className="summary-label">Completed:</span>
          <strong className="summary-value">{props.done}</strong>
        </div>
    </>
    
  )
}

export default SummaryCards

