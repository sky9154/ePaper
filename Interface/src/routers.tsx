import { FC, lazy, LazyExoticComponent, Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen';


const loadable = (Component: LazyExoticComponent<FC>) => (props: any) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

const Home = loadable(lazy(() => import('./pages/Home')));
const EventCreate = loadable(lazy(() => import('./pages/Event/Create')));
const DeviceCreate = loadable(lazy(() => import('./pages/Device/Create')));
const Device = loadable(lazy(() => import('./pages/Device')));
const Error = loadable(lazy(() => import('./pages/404')));

const routes = [
  {
    exact: true,
    path: '/',
    element: (
      <Home />
    )
  }, {
    path: '/event/create',
    element: (
      <EventCreate />
    )
  }, {
    path: '/device/create',
    element: (
      <DeviceCreate />
    )
  }, {
    path: '/device',
    element: (
      <Device />
    )
  }, {
    path: '*',
    element: (
      <Error />
    )
  }
];

export default routes;