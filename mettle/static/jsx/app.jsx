(function() {
  var Router = ReactRouter;
  var Route = Router.Route;
  var NotFoundRoute = Router.NotFoundRoute;
  var RouteHandler = Router.RouteHandler;
  var Link = Router.Link;

  var NotFound = Mettle.components.NotFound = React.createClass({
    render: function() {
      return (<p>That page cannot be found.</p>);
    }
  });

  Breadcrumbs = React.createClass({
    mixins: [Router.State],
    render: function() {
      var links = [];
      var params = this.getParams();

      if (params.serviceName) {
        links.push(<li key={params.serviceName}>
          <Link to="Service" params={params}>Service: {params.serviceName}</Link>
          </li>);
        if (params.pipelineName) {
          links.push(<li key={params.pipelineName}>
            <Link to="Pipeline" params={params}>Pipeline: {params.pipelineName}</Link>
            </li>);
          if (params.runId) {
            links.push(<li key={"run-" + params.runId}>
              <Link to="PipelineRun" params={params}> Run: {params.runId}</Link>
              </li>);
            if (params.target) {
              links.push(<li key={params.target}>
                <Link to="Target" params={params}>Target: {params.target}</Link>
                </li>);
              if (params.jobId) {
                links.push(<li key={"job-" + params.jobId}>
                    <Link to="Job" params={params}>Job: {params.jobId}</Link>
                    </li>);
              }
            }
          }
        }
      }
      return (<ul className="mettle-nav list-inline ">{links}</ul>);
    }
  });

  App = React.createClass({
    mixins: [Router.State],
    render: function () {
      var inside = this.getParams().serviceName ? <RouteHandler /> : <Mettle.components.ServicesList />;
      return (
        <div>
          <header  className="pure-u-1">
            <h1 className="title"><Link to="App">Mettle</Link></h1>
            <Breadcrumbs />
          </header>
          {inside} 
        </div>
      );
    }
  });

  var routes = (
    <Route name="App" path="/" handler={App}>
      <Route name="Service" path="services/:serviceName/" handler={Mettle.components.Service}>
        <Route name="Pipeline" path="pipelines/:pipelineName/" handler={Mettle.components.Pipeline}>
          <Route name="PipelineRun" path="runs/:runId/" handler={Mettle.components.PipelineRun}>
            <Route name="Target" path="targets/:target/" handler={Mettle.components.Target}>
              <Route name="Job" path="jobs/:jobId/" handler={Mettle.components.Job} />
            </Route>
          </Route>
        </Route>
      </Route>
      <NotFoundRoute handler={Mettle.components.NotFound} />
    </Route>
  );

  Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('content'));
  });
})();