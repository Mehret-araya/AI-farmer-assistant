import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="public-page landing-page">
      <div className="landing-grid">
        <div className="landing-copy">
          <span className="eyebrow">Built for the field</span>
          <h1>Better decisions for every growing season.</h1>
          <p className="lead">Practical crop intelligence, weather context, and trusted agricultural guidance in one calm workspace.</p>
          <div className="landing-actions">
            <Link to="/register" className="button button-primary">Create a farmer account</Link>
            <Link to="/login" className="button button-secondary">Sign in</Link>
          </div>
          <div className="landing-proof"><span>01</span><p>Track crops<br />Understand risk<br />Act with confidence</p></div>
        </div>
        <div className="landing-panel">
          <div className="field-lines" />
          <div className="landing-panel-content"><span className="panel-kicker">Today on your farm</span><strong>Observe. Ask. Grow.</strong><p>Keep your crop history close and get clear next steps when conditions change.</p></div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;