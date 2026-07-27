import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { conError: false };
  }

  static getDerivedStateFromError() {
    return { conError: true };
  }

  componentDidCatch(error) {
    console.error("Error al cargar la página:", error);
  }

  render() {
    if (this.state.conError) {
      return (
        <section style={{ padding: "80px 24px", textAlign: "center" }}>
          <h2>Ocurrió un problema al cargar la página</h2>
          <p>Puede deberse a una conexión inestable. Probá recargar la página.</p>
          <button className="btn-principal" style={{ marginTop: "20px" }} onClick={() => window.location.reload()}>
            Recargar página
          </button>
        </section>
      );
    }
    return this.props.children;
  }
}
