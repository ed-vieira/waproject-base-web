import React, { memo } from 'react';
import { Route, Switch } from 'react-router-dom';

import OrderListPage from './List';

const OrdersIndexPage = memo(() => {
  return (
    <Switch>
      <Route path='/' component={OrderListPage} />
    </Switch>
  );
});

export default OrdersIndexPage;
