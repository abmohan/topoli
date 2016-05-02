import {bootstrap} from 'angular2/platform/browser';
import {Component} from 'angular2/core';
import {enableProdMode} from 'angular2/core';

enableProdMode();

@Component({
  selector: 'app',
  template: '<h1>TOpoli!!!!!!</h1>'
})
class App {}

bootstrap(App);
