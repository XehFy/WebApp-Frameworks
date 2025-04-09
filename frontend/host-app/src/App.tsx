import React, { Suspense } from 'react';

import logo from './logo.svg';
import './App.css';

const RemoteRTKApp = React.lazy(() => import("rtkApp/App")); 
const RemoteMobXApp = React.lazy(() => import("mobxApp/App")); 

function App() {
  return (
    <div>
      <h1>Host Application</h1>
      
      <Suspense fallback="Loading RTK App...">
        <RemoteRTKApp />
      </Suspense>

      <Suspense fallback="Loading MobX App...">
        <RemoteMobXApp />
      </Suspense>
    </div>
  );
}

export default App;
