import { FC, lazy, LazyExoticComponent, Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen';
import AppBar from './components/Layouts/AppBar';


const loadable = (Component: LazyExoticComponent<FC>) => (props: any) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

const Home = loadable(lazy(() => import('./pages/Home')));
const EventCreate = loadable(lazy(() => import('./pages/Event/Create')));
const DeviceCreate = loadable(lazy(() => import('./pages/Device/Create')));
const DeviceGrid = loadable(lazy(() => import('./pages/Device/Grid')));
const Error = loadable(lazy(() => import('./pages/404')));

const routes = [
  {
    exact: true,
    path: '/',
    element: (
      <AppBar>
        <Home />
      </AppBar>
    )
  }, {
    path: '/event/create',
    element: (
      <AppBar>
        <EventCreate />
      </AppBar>
    )
  }, {
    path: '/device/create',
    element: (
      <AppBar>
        <DeviceCreate />
      </AppBar>
    )
  }, {
    path: '/device',
    element: (
      <AppBar>
        <DeviceGrid />
      </AppBar>
    )
  }, {
    path: '*',
    element: (
      <Error />
    )
  }
];

export default routes;