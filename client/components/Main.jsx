import React from 'react';
import Router from 'react-router';

var RouteHandler = Router.RouteHandler;

export default class Main extends React.Component {
  render() {
    return (
      <div>
        <nav className="clearfix white bg-black">
          <div className="sm-col">
            <a href="/" className="btn py2">Home</a>
          </div>
          <div className="sm-col-right">
            <a href="/" className="btn py2">About</a>
          </div>
        </nav>
        <div>
          <RouteHandler />
        </div>
      </div>
    );
  }
};
