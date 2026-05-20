import React from "react";
import "./panel.css";

export default function Panel( {children, title, action, style} ) {

  if (action && (action.type.name == "LinkComponent" || action.type == 'a')) {
    action = React.cloneElement(action, {
      className: action.props.className ? `${action.props.className} ${'button'}` : 'button',
    });
  }

  return (
    <div className="panel" style={style}>
      { title  ? <div className="title"><h2>{title}</h2>
        { action }
      </div> : null }
      <div className="content">
        { children }
      </div>
    </div>
  );
}