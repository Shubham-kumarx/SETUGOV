import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import App from './App.jsx';

class AppErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, fontFamily: 'system-ui', color: '#17243b' }}><div style={{ maxWidth: 720 }}><h1>SetuGov could not load</h1><p>{this.state.error.message}</p><pre style={{ whiteSpace: 'pre-wrap', background: '#f1f4f8', padding: 16, borderRadius: 8, fontSize: 12 }}>{this.state.error.stack}</pre></div></main>;
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><AppErrorBoundary><BrowserRouter><App /></BrowserRouter></AppErrorBoundary></React.StrictMode>);
