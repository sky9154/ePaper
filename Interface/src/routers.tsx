import { FC, lazy, LazyExoticComponent, Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen';
import AppBar from './components/Layouts/AppBar';


const loadable = (Component: LazyExoticComponent<FC>) => (props: any) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

const Home = loadable(lazy(() => import('./pages/Home')));
const EventGrid = loadable(lazy(() => import('./pages/Event/Grid')));
const EventCreate = loadable(lazy(() => import('./pages/Event/Create')));
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
    path: '/event',
    element: (
      <AppBar>
        <EventGrid />
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