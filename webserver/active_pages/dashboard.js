module.exports = {
  render: function(req, res){
    // Rendering out the dashboard page.
    var htmlOutput = `<!DOCTYPE html>
      <html>
        <head>
          <title>Dashboard</title>
          <script type="text/javascript" scr="/static/scripts/std.js"></script>
          <link rel="stylesheet" type="text/css" href="/static/style/master.css"/>
        </head>

    `

    // Just for now:
    htmlOutput += `<body>
    <div class="warning-dialogue-container"><div class="warning-dialogue info"><h1>Woah there!</h1><p>This is still under development</p></div></div>
    <h1>Dashboard!</h2>`;

    // At the end...

    htmlOutput += "&copy;2017 Peter East.</body></html>"
    res.send(htmlOutput)

  }
}
