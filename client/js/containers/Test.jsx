import React from 'react';

export default class Test extends React.Component {
  render() {
    return (
      <div>
        <div style={{padding: '30px 0', textAlign: 'center', fontSize: '28px'}}>Test</div>
        <div style={{border: '1px solid #cccccc', borderRadius: '5px', padding: '20px'}}>
          <span>Authenticated Page</span>
        </div>
      </div>
    );
  }
}
