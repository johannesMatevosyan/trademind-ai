import { render } from '@testing-library/react';

import MarketStatusCard from './market-status-card';

describe('MarketStatusCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MarketStatusCard />);
    expect(baseElement).toBeTruthy();
  });
});
