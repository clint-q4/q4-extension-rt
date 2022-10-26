

export default function ThemeToggleSwitch(props) {

  const switchMode = (id) => {
    const el = (document.getElementById(id) as HTMLInputElement)
    const checked = el.checked;
    const nTheme = checked ? 'dark' : 'light';
    props.setTheme(nTheme);
  }

  return (
    <div className="theme-toggle-switch-container">
      <input onChange={() => switchMode('theme-toggle-switch')} id="theme-toggle-switch" title="toggle-switch" type="checkbox" />
      <div className="circle">
        <div className="crescent"></div>
      </div>
    </div>
  )
}
