import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  user: null,
  role: null,
  token: null,
  status: 'idle',
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      // TODO: In Stage 5+ will connect login() to API using axios and set token
      return { 
        ...state, 
        user: action.payload.user,
        role: action.payload.user.role,
        token: action.payload.token,
        status: 'authenticated' 
      };
    case 'LOGOUT':
      // TODO: Clear token from localStorage
      return { ...initialState, status: 'idle' };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKEN':
      // TODO: Persist token to localStorage
      return { ...state, token: action.payload };
    case 'REGISTER':
      // TODO: In Stage 5+ will connect register() to API
      return state;
    default:
      return state;
  }
}

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}

export function useAuth() {
  const state = useContext(AuthStateContext);
  const dispatch = useContext(AuthDispatchContext);
  if (state === undefined || dispatch === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  // Skeleton functions
  const login = (payload) => dispatch({ type: 'LOGIN', payload });
  const logout = () => dispatch({ type: 'LOGOUT' });
  const setUser = (user) => dispatch({ type: 'SET_USER', payload: user });
  const setToken = (token) => dispatch({ type: 'SET_TOKEN', payload: token });
  const register = (payload) => dispatch({ type: 'REGISTER', payload });
  return { ...state, login, logout, setUser, setToken, register };
}
