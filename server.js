const express = require('express');
const path = require('path');
const parser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

const clientBundles = './public/services';
const serverBundles = './templates/services';
const serviceConfig = require('./service.json');
const services = require('./loader.js')(clientBundles, serverBundles, serviceConfig);

const React = require('react');
const ReactDom = require('react-dom/server');
const Layout = require('./templates/layout');
const App = require('./templates/app');
const scripts = require('./templates/scripts');

const renderComponents = (components, props = {}) => {
  return Object.keys(components).map(item => {
    let component = React.createElement(component[item], props);
    return ReactDom.renderToString(component);
  })
}

app.listen(port, () => {
  console.log(`Server running at PORT : ${port}`)
})