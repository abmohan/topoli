import React from 'react';
import Router from 'react-router';
import routes from '../config/routes';

Router.run(routes, function(Root){
  React.render(<Root />, document.getElementById('app'));
});
