import "./sliders.css";
import { StatBox } from "../stats/stats";

export function SPslider({id, label, value, onChange, steps = [], displayValue = 0}) {
  const max = steps.reduce((p, c) => p.value > c.value ? p.value : c.value);

  let options = [];
  let segments = [];
  if (steps.length > 0) {
    steps.map((step, index) => {
      let numerator = index > 0 ? step.value - steps[index-1].value : step.value;
      options.push(<option key={index} value={step.value} label={step.label}>2</option>)
      segments.push(<div key={index} className="segment" style={{width: 'calc('+ numerator + ' / ' + max + ' * 100%)'}}>
        <span>{step.label}</span>
        <span>{step.value}</span>
      </div>);
    });
  }

  return (<>
    <div className="row">
      <StatBox label={label}>{displayValue}</StatBox>
      <div className="sp-slider">
        <div className="label-wrapper">
          <label htmlFor={id} style={{left: value / max * 100 + '%'}}>{value}</label>
        </div>
        <input
          type="range"
          list={id + 'list'}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          min={0}
          max={max}
          step={10}
          />
          <datalist id={id + 'list'}>
            {options}
          </datalist>
          <div className="track" style={{background: 'linear-gradient(to right, var(--fill-color) ' + value  / max * 100 + '%, var(--background-color) ' + value  / max * 100 + '%)'}}>
            {segments}
          </div>
        </div>
    </div>
  </>);
}