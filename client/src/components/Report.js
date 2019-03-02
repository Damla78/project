import React from 'react';

const Report = ({ report }) => (
  <div>
    valid houses:{report.valid}
    <br />
    invalid houses ({report.invalid.count}): {' '}
    {report.invalid.items.map((data, index) => (
      <div key={index}>
        messages:<pre>{JSON.stringify(data.error, null, 2)}</pre>
        raw:<pre>{JSON.stringify(data.raw, null, 2)}</pre>
      </div>)
    )}
  </div>
);

export default Report;