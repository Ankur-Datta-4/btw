import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { BrowserRouter, HashRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { selectUser } from 'selectors';
import useTreeChanges from 'tree-changes-hook';
import { useAppSelector } from 'modules/hooks';

import toast, { Toaster } from 'react-hot-toast';

import { getUser } from 'actions';
// import Home from 'routes/Home';
import Login from './routes/Login';
import Dash from './routes/Dash';
import NotFound from 'routes/NotFound';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';

function Root() {
  const dispatch = useDispatch();
  const userState = useAppSelector(selectUser);
  const { changed } = useTreeChanges(userState);

  const { user } = userState;
  const { isLoggedIn } = user;

  useEffect(() => {
    // get user details if it is the first time
    dispatch(getUser());
  }, []);

  useEffect(() => {
    if (changed('user.isLoggedIn', true) && isLoggedIn) {
      toast.success('Logged In!');
    }
  }, [dispatch, changed]);

  // create a component that checks if the environment is electron, then it would be BrowserRouter
  // otherwise, it would be HashRouter
  // this is because electron does not support hash routing
  // but the web version does
  // so, we need to check if it is electron or not
  // and then use the correct router
  // this is a temporary solution
  // we need to find a better way to do this
  // maybe we can use a custom hook to check if it is electron or not
  // and then use the correct router

  const Router = process.env.REACT_APP_ELECTRON ? HashRouter : BrowserRouter;

  console.log('user', user);

  return (
    <Router>
      <div>
        <Helmet
          defaultTitle={'btw ∴'}
          defer={false}
          encodeSpecialCharacters
          htmlAttributes={{ lang: 'pt-br' }}
          titleAttributes={{ itemprop: 'name', lang: 'en-en' }}
          titleTemplate={`%s | btw ∴`}
        >
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        </Helmet>
        {/* {isLoggedIn && <Login />} */}
        {/* <Main isAuthenticated={isAuthenticated}> */}
        <Routes>
          <Route
            element={
              <PrivateRoute isLoggedIn={isLoggedIn} to="/login">
                <Dash userId={user.data.id} />
              </PrivateRoute>
            }
            path="/dash"
          />
          <Route
            element={
              <PublicRoute isLoggedIn={isLoggedIn} to="/dash">
                <Login />
              </PublicRoute>
            }
            path="/login"
          />
          <Route
            element={
              <PublicRoute isLoggedIn={isLoggedIn} to="/dash">
                <Login />
              </PublicRoute>
            }
            path="/"
          />
          <Route element={<NotFound />} path="*" />
        </Routes>
        <Toaster />
        {/* </Main> */}
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default Root;
