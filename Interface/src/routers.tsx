import { FC, lazy, LazyExoticComponent, Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen';
import PageMenu from './components/Layouts/PageMenu';


const loadable = (Component: LazyExoticComponent<FC>) => (props: any) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

const Home = loadable(lazy(() => import('./pages/Home')));
const EventGrid = loadable(lazy(() => import('./pages/Event/Grid')));
const EventCreate = loadable(lazy(() => import('./pages/Event/Create')));
const DeviceGrid = loadable(lazy(() => import('./pages/DeviceGrid')));
const Canvas = loadable(lazy(() => import('./pages/Canvas')));
const Error = loadable(lazy(() => import('./pages/404')));

const routes = [
  {
    exact: true,
    path: '/',
    element: (
      <PageMenu>
        <Home />
      </PageMenu>
    )
  }, {
    path: '/event',
    element: (
      <PageMenu>
        <EventGrid />
      </PageMenu>
    )
  }, {
    path: '/event/create',
    element: (
      <PageMenu>
        <EventCreate />
      </PageMenu>
    )
  }, {
    path: '/device',
    element: (
      <PageMenu>
        <DeviceGrid />
      </PageMenu>
    )
  }, {
    path: '/canvas',
    element: (
      <PageMenu>
        <Canvas />
      </PageMenu>
    )
  }, {
    path: '*',
    element: (
      <Error />
    )
  }
];

export default routes;