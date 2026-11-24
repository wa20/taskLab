

const Toolbar = () => {
  return (
    <>  
    <div className="form-field">
        <label htmlFor="task-search">Search tasks</label>
        <input type="search" id="task-search" placeholder="Search..."/>
    </div>
        
    <div className="form-field">
      <label htmlFor="task-priority">Priority</label>
        <select id="task-priority">
            <option value="all">All priorities</option>
            <option value="1">High</option>
            <option value="2">Medium</option>
            <option value="3">Low</option>
        </select>
    </div>
        
    </>
    
  )
}

export default Toolbar