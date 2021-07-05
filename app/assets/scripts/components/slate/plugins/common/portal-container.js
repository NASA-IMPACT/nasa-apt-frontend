import { createPortal } from 'react-dom';

export default function PortalContainer({ children }) {
  return createPortal(children, document.querySelector('#app-container'));
}
