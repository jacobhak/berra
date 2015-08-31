/*global Parse, ReactRouter, React, md5*/

Parse.initialize("AqnO6aCXC4jn8MNWxxY3sLeb4eQEgDfQbRZzeDO6", "54LZ0uAgocsC5cvXkVjtKTeybPPIqUzp4nzgBkIv");

var Router = ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var Spelare = Parse.Object.extend('Spelare');
var Spel = Parse.Object.extend('Spel');
var Omgang = Parse.Object.extend('Omgang');

var NewSpelareForm = React.createClass({
  getInitialState : function() {
    return {namn: ''};
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var spelare = new Spelare();
    spelare.set('namn', this.state.namn);
    
    spelare.save(null, {
      success: function() {
        console.log("Spelare tillagd");
	this.props.parentUpdate();
      }.bind(this),
      error: function() {
        console.log("Fel när spelare skulle läggas till");
      }
    });
    this.setState({namn: ''});
  },
  handleChange: function() {
    this.setState({namn: this.refs.namnField.getDOMNode().value});
  },
  render: function() {
    return (
        <div>
        <form onSubmit= {this.handleSubmit}>
        <input ref="namnField" name='namn' type="text" value={this.state.namn} onChange={this.handleChange}/>
	<div>
	<button type="submit">Lägg till</button>
	</div>
        </form>
        </div>
    );
  }
});



var NewOmgangForm = React.createClass({
  getInitialState : function() {
    return {vinnare: '', spel: ''};
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var omgang = new Omgang();
    this.handleChange();
    console.log(this.state);
    omgang.set('vinnare', this.state.vinnare);
    omgang.set('spel', this.state.spel);
    omgang.set('datum', new Date().toISOString());
    omgang.save(null, {
      success: function() {
        console.log("Omgång tillagd");
        this.props.parentUpdate();
      }.bind(this),
      error: function() {
        console.log("Fel när Omgång skulle läggas till");
      }
    });
    this.setState({vinnare: '', spel: ''});
  },
  handleChange: function() {
    this.setState({
      vinnare: this.refs.vinnareField.getDOMNode().value,
      spel: this.refs.spelField.getDOMNode().value
    });
    console.log(this.state);
  },
  render: function() {
    var spelare = this.props.spelare.map(function(spelaren) {
      return (
	  <option value={spelaren.get('namn')}>{spelaren.get('namn')}</option>
      );
    });
    var spel = this.props.spel.map(function(spelet) {
      return (
          <option value={spelet.get('namn')}>{spelet.get('namn')}</option>
      );
    });
    var inputStyle = {
      display: "inline-block"
    };
    return (
        <div>
        <form onSubmit= {this.handleSubmit}>
	<div style={inputStyle}>
	<label htmlFor="spel">Spel</label>
        <select ref="spelField" name='spel' value={this.state.spel} onChange={this.handleChange}>
	<option value=''></option>
        {spel}
      </select>
	</div>
	<div style={inputStyle}>
        <label htmlFor="vinnare">Vinnare</label>
        <select ref="vinnareField" name='vinnare' value={this.state.vinnare} onChange={this.handleChange}>
	<option value=''></option>
	{spelare}
      </select>
	</div>
	<div>
        <button type="submit">Lägg till</button>
	</div>
        </form>
        </div>
    );
  }
});

var NewSpelForm = React.createClass({
  getInitialState : function() {
    return {namn: ''};
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var spelare = new Spel();
    spelare.set('namn', this.state.namn);
    spelare.save(null, {
      success: function() {
        console.log("Spel tillagd");
        this.props.parentUpdate();
      }.bind(this),
      error: function() {
        console.log("Fel när spel skulle läggas till");
      }
    });
    this.setState({namn: ''});
  },
  handleChange: function() {
    this.setState({namn: this.refs.namnField.getDOMNode().value});
  },
  render: function() {
    return (
        <div>
        <form onSubmit= {this.handleSubmit}>
        <input ref="namnField" name='namn' type="text" value={this.state.namn} onChange={this.handleChange}/>
	<div>
        <button type="submit">Lägg till</button>
	</div>
        </form>
        </div>
    );
  }
});

var SpelareList = React.createClass({
  render: function() {
    var nodes = this.props.data.map(function(spelare) {
      return (
          <SpelareComponent data={spelare}/>
      );
    });
    return (
        <div className="commentList">
        {nodes}
      </div>
    );
  }
});
var OmgangList = React.createClass({
  render: function() {
    var nodes = this.props.data.map(function(omgang) {
      return (
          <OmgangListComponent data={omgang}/>
      );
    });
    return (
        <div className="commentList">
        {nodes}
      </div>
    );
  }
});

var OmgangListComponent = React.createClass({
  render: function() {
    var date = this.props.data.get('datum');
    if (date !== undefined) {
      date = this.props.data.get('datum').split("T")[0];
    }
    return (
        <div className="comment">
        <h2 className="commentAuthor">
        {date}
      </h2>
	<div>
	Vinnare: {this.props.data.get("vinnare")}
      </div>
	<div>
	Spel: {this.props.data.get('spel')}
      </div>
        </div>      
    );
  }
});

var SpelareComponent = React.createClass({
  render: function() {
    return (
        <div className="comment">
        <h2 className="commentAuthor">
        {this.props.data.get("namn")}
      </h2>
	</div>
    );
  }
});



var SpelarePage = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadSpelareFromServer: function() {
    var query = new Parse.Query(Spelare);
    query.find({
      success: function (spelare) {
        this.setState({data: spelare});
        console.log(this.state.data);
      }.bind(this),
      error: function (object, error) {
        console.log(error);
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadSpelareFromServer();
  },
  render: function() {
    return (
        <div>
	<h1>Spelare</h1>
        <NewSpelareForm parentUpdate={this.loadSpelareFromServer}/>
	<SpelareList data={this.state.data} />
        </div>
    );
  }
});

var SpelPage = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadSpelFromServer: function() {
    var query = new Parse.Query(Spel);
    query.find({
      success: function (spel) {
        this.setState({data: spel});
        console.log(this.state.data);
      }.bind(this),
      error: function (object, error) {
        console.log(error);
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadSpelFromServer();
  },
  render: function() {
    return (
        <div>
	<h1>Spel</h1>
	<NewSpelForm parentUpdate={this.loadSpelFromServer}/>
        <SpelareList data={this.state.data} />
        </div>
    );
  }
});

var OmgangPage = React.createClass({
  getInitialState: function() {
    return {data: [], spelare: [], spel: []};
  },
  loadOmgangarFromServer: function() {
    var query = new Parse.Query(Omgang);
    query.find({
      success: function (omgang) {
        this.setState({data: omgang});
        console.log(this.state.data);
      }.bind(this),
      error: function (object, error) {
        console.log(error);
      }.bind(this)
    });
  },
  loadSpelareFromServer: function() {
    var query = new Parse.Query(Spelare);
    query.find({
      success: function (spelare) {
        this.setState({spelare: spelare});
      }.bind(this),
      error: function (object, error) {
        console.log(error);
      }.bind(this)
    });
  },
  loadSpelFromServer: function() {
    var query = new Parse.Query(Spel);
    query.find({
      success: function (spel) {
        this.setState({spel: spel});
      }.bind(this),
      error: function (object, error) {
        console.log(error);
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadOmgangarFromServer();
    this.loadSpelareFromServer();
    this.loadSpelFromServer();
  },
  render: function() {
    return (
        <div>
	<h1>Omgångar</h1>
	<NewOmgangForm parentUpdate={this.loadOmgangarFromServer} spelare={this.state.spelare} spel={this.state.spel}/>
	<OmgangList data={this.state.data}/>
        </div>
    );
  }
});

var App = React.createClass({
  render: function() {
    var ulStyle = {
      display: "inline",
      
      marginRight: "10px",
      marginBottom: "50px"
    };
    var divStyle = {
      textAlign: "center"
    };
    return (
        <div>
	<div style={divStyle}>
	<ul style={ulStyle}>
	<li style={ulStyle}><Link to="omgang">Omgångar</Link></li>
	<li style={ulStyle}><Link to="spelare">Spelare</Link></li>
	<li style={ulStyle}><Link to="spel">Spel</Link></li>
	</ul>
	</div>
        <RouteHandler />
        </div>
      );
  }
});


var routes = (
    <Route handler={App} path="/">
    <DefaultRoute handler={OmgangPage} />
    <Route name="spel" handler={SpelPage} path="spel"></Route>
    <Route name="spelare" handler={SpelarePage} path="spelare"></Route>
    <Route name="omgang" handler={OmgangPage} path="omgang"></Route>
    </Route>
);

Router.run(routes, function (Handler) {
  React.render(
      <Handler />, document.getElementById('main')
  );
});
