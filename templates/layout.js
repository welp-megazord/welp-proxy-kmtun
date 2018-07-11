module.exports = (title, body, scripts) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
    </head>
    <body style="margin:0px">
    ${body}
    </body>
    ${scripts}
    <link rel="stylesheet" type="text/css" href="external.css" />
  </html>
`;
