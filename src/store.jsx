import React, { useReducer } from 'react';

const initial = {
  activeBotId: null,
  activeThreadId: null,
  view: 'chat',
  modal: null,
  gateway: { ok: null, modelsCount: 0, lastCheck: null },
  sidebarOpen: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'selectBot':
      return { ...state, activeBotId: action.id, activeThreadId: null };
    case 'selectThread':
      return { ...state, activeThreadId: action.id };
    case 'setView':
      return { ...state, view: action.view };
    case 'setModal':
      return { ...state, modal: action.modal };
    case 'setGateway':
      return { ...state, gateway: { ...state.gateway, ...action.patch } };
    case 'toggleSidebar':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    default:
      return state;
  }
}

const StoreCtx = React.createContext(null);
const DispatchCtx = React.createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);
  return (
    <StoreCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
    </StoreCtx.Provider>
  );
}

export const useStore = () => React.useContext(StoreCtx);
export const useDispatch = () => React.useContext(DispatchCtx);
