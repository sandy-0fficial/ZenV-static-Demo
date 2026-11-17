import { renderToString } from 'react-dom/server';
import App, { type Boot } from './App';
export function render(boot: Boot) { return renderToString(<App boot={boot}/>); }
