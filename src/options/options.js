import { Input, InputLabel } from '@mui/material';
import React from 'react';
import { createRoot } from 'react-dom/client';

class OptionsPage extends React.Component {
  constructor(props) {
    super(props);
    chrome.storage.local.get(['api_key', 'database_ids'], (result) => {
      this.setState({ api_key: result.api_key || "", database_ids: result.database_ids || "" });
    });
  }
  setOption(key, value) {
    // const obj = {};
    // obj[key] = value;
    this.setState({ [key]: value });
  }

  save() {
    chrome.storage.local.set({ api_key: this.state.api_key, database_ids: this.state.database_ids });
  }

  render() {
    return (
      <div>
        <h1>Options Page</h1>
        <div>
          <InputLabel htmlFor="api_key">API Key</InputLabel>
          <Input id="api_key" value={this.state.api_key} onChange={(event) => {
            this.setOption('api_key', event.target.value);
          }} />
        </div>
        <div>
          <InputLabel htmlFor="database_ids">Database IDs</InputLabel>
          <Input id="database_ids" value={this.state.databaase_ids} onChange={(event) => {
            this.setOption('database_ids', event.target.value);
          }} />
        </div>
        <div>
          <button onClick={this.save}>Save</button>
        </div>
      </div>
    );
  }
}


const root = createRoot(document.querySelector('#root'));
root.render(<OptionsPage />);