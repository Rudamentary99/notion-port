import { useState } from 'react';
import ReactDOM from 'react-dom';
import React from 'react';
import { getActiveTabInfo } from "../utils/browserUtils"
// import { ErrorFallback } from "../comps/ErrorFallback"
// import "./popup.scss"
import { createRoot } from "react-dom/client"
import { FormControl, InputLabel, MenuItem, Select, Box, Button } from '@mui/material';

export function Option({ onChange}) {
    const options = [
        "custom",
    ];
    const [selector, setSelector] = useState('');
    const handleChange = (event) => {
        setSelector(event.target.value);
    };

    return (
        <div>
            <InputLabel id="basic-select-label">Selector</InputLabel>
            <Select
                labelId="basic-select-label"
                id="basic-select"
                label="Selector"
                value={selector}
                onChange={handleChange}
            >
                {options.map((option, index) => (
                    <MenuItem key={option + index} value={option}>{option}</MenuItem>
                ))}
            </Select>
            <p>Selected: {selector}</p>
        </div>
    );
}

export function App(props) {
    
    return (
        <Box sx={{ minWidth:120}}>
            <Button variant='contained' onClick={e => {chrome.runtime.openOptionsPage()}}>Options</Button>
        </Box>
    );
}

// Promise.all([
// getActiveTabInfo().then(tabInfo => {
//   gvar.tabInfo = tabInfo
//   gvar.tabInfo || window.close()
// })
//   ]).then(() => {
const root = createRoot(document.querySelector("#root"))
root.render(<App />)
//   })