import { BrandLogo } from "../ui/BrandLogo";

function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <BrandLogo size={28} />
        <span className="app-name">Saarthi Resume</span>
      </div>
    </header>
  );
}

export default Topbar;
