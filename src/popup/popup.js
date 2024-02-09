import { useState } from 'react';
import ReactDOM from 'react-dom';
import React from 'react';
import { getActiveTabInfo } from "../utils/browserUtils"
// import { ErrorFallback } from "../comps/ErrorFallback"
// import "./popup.scss"
import { createRoot } from "react-dom/client"

export function App(props) {
    const [count, setCount] = useState(0);
    console.log('App()');

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}

// Promise.all([
    // getActiveTabInfo().then(tabInfo => {
    //   gvar.tabInfo = tabInfo
    //   gvar.tabInfo || window.close()
    // })
//   ]).then(() => {
    const root = createRoot(document.querySelector("#root"))
    root.render(<App/>)
//   })