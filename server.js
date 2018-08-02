const express = require('express');
const path = require('path');
const parser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;
const request = require('request');
const rp = require('request-promise');

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
const Scripts = require('./templates/scripts');

// Object.values(serviceConfig).forEach(service => {
//   service.routes.forEach(route => {
//     app.use(route, (req, res) => {
//       const target = service.server + req.originalUrl;
//       // console.log('Proxy', req.originalUrl, '=>', target);
//       fetch(target)
//         .then(proxied => { proxied.body.pipe(res); })
//         .catch(err => {
//           console.error(`Error getting ${target}:`, err);
//           res.status(500).send('Internal server error');
//         });
//     });
//   });
// });
// Object.values(serviceConfig).forEach(service => {
//   service.routes.forEach(route => {
//     app.use(route, (req,res) => {
//       // console.log(req.originalUrl);
//       const target = service.server + req.originalUrl;
//       request(target).pipe(res);
//     })
//   })
// })

Object.values(serviceConfig).forEach(service => {
  service.routes.forEach(route => {
    app.use(route, (req,res) => {
      // console.log(req.originalUrl);
      const target = service.server + req.originalUrl;
      rp(target)
        .then(data => {
          res.status(200).send(data);
        })
        .catch(err => {
          console.log(`Error getting ${target}:`, err);
          res.status(500).send('Internal server error');
        })
    })
  })
})

const renderComponents = (components, props = {}) => {
  return Object.keys(components).map(item => {
    let component = React.createElement(components[item], props);
    return ReactDom.renderToString(component);
  })
}

app.get('/', (req, res) => {
  let components = renderComponents(services, {apiHost: `http://localhost:${port}`});
  res.send(Layout(
    'SDC Demo',
    App(...components),
    Scripts(Object.keys(services))
  ));
  // res.status(200).send('');
});

app.listen(port, () => {
  console.log(`Server running at PORT : ${port}`)
})