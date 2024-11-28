import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NavbarComponent from '@components/navbar';
import { AppContext } from '@context/AppContext';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('NavbarComponent', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when user is not logged in', () => {
    const contextValue = {
      userIsLoggedIn: false,
      setUserIsLoggedIn: jest.fn(),
      user: null,
      setUser: jest.fn(),
    };

    render(
      <AppContext.Provider value={contextValue}>
        <NavbarComponent />
      </AppContext.Provider>
    );

    expect(screen.getByAltText('Logo')).toBeVisible();
    expect(screen.getByText('Home')).toBeVisible();
    expect(screen.getByText('Login')).toBeVisible();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('renders correctly when user is logged in', () => {
    const contextValue = {
      userIsLoggedIn: true,
      setUserIsLoggedIn: jest.fn(),
      user: { name: 'Test User' },
      setUser: jest.fn(),
    };

    render(
      <AppContext.Provider value={contextValue}>
        <NavbarComponent />
      </AppContext.Provider>
    );

    expect(screen.getByAltText('Logo')).toBeVisible();
    expect(screen.getByText('Home')).toBeVisible();
    expect(screen.getByText('Logout')).toBeVisible();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('navigates to home page when Home is clicked', () => {
    const contextValue = {
      userIsLoggedIn: true,
      setUserIsLoggedIn: jest.fn(),
      user: { name: 'Test User' },
      setUser: jest.fn(),
    };

    render(
      <AppContext.Provider value={contextValue}>
        <NavbarComponent />
      </AppContext.Provider>
    );

    fireEvent.click(screen.getByText('Home'));
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('navigates to login page when Login is clicked', () => {
    const contextValue = {
      userIsLoggedIn: false,
      setUserIsLoggedIn: jest.fn(),
      user: null,
      setUser: jest.fn(),
    };

    render(
      <AppContext.Provider value={contextValue}>
        <NavbarComponent />
      </AppContext.Provider>
    );

    fireEvent.click(screen.getByText('Login'));
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('logs out user when Logout is clicked', () => {
    const contextValue = {
      userIsLoggedIn: true,
      setUserIsLoggedIn: jest.fn(),
      user: { name: 'Test User' },
      setUser: jest.fn(),
    };

    render(
      <AppContext.Provider value={contextValue}>
        <NavbarComponent />
      </AppContext.Provider>
    );

    fireEvent.click(screen.getByText('Logout'));
    expect(contextValue.setUserIsLoggedIn).toHaveBeenCalledWith(false);
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });
});