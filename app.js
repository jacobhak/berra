/*global Parse, md5*/

Parse.initialize("AqnO6aCXC4jn8MNWxxY3sLeb4eQEgDfQbRZzeDO6", "54LZ0uAgocsC5cvXkVjtKTeybPPIqUzp4nzgBkIv");

var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var utils = require('./utils.js');
var IndexRoute = require('react-router').IndexRoute;
var Link = require('react-router').Link;
var Route = require('react-router').Route;

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
        <form onSubmit={this.handleSubmit}>
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
    var sorted = this.props.data.slice().sort(function(a, b) {
      return b.vinster - a.vinster;
    });
    var nodes = sorted.map(function(spelare) {
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

var SpelList = React.createClass({
  render: function() {
    var nodes = this.props.data.map(function(spelare) {
      return (
          <SpelComponent data={spelare}/>
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
    }).reverse();
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
        {this.props.data["spelare"]}: {this.props.data["vinster"]}
      </h2>
	</div>
    );
  }
});

var SpelComponent = React.createClass({
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
    return {spelare: [], omgangar: []};
  },
  loadSpelareFromServer: function() {
    var query = new Parse.Query(Spelare);
    var coll = query.collection();
    coll.fetch({
      success: function (spelare) {
        this.setState({spelare: spelare});
        console.log(this.state);
      }.bind(this),
      error: function (object, error) {
        console.log(error);
      }.bind(this)
    });
  },
  loadOmgangarFromServer: function() {
    var query = new Parse.Query(Omgang);
    var coll = query.collection();
    coll.fetch({
      success: function (omgang) {
        this.setState({omgangar: omgang});
        console.log(this.state);
      }.bind(this),
      error: function (object, error) {
        console.log(error);
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadSpelareFromServer();
    this.loadOmgangarFromServer();
  },
  render: function() {
    return (
        <div>
	<h1>Spelare</h1>
        <NewSpelareForm parentUpdate={this.loadSpelareFromServer}/>
	<SpelareList data={utils.spelareToVinster(this.state.spelare, this.state.omgangar)} />
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
        <SpelList data={this.state.data} />
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
	{this.props.children}
        </div>
      );
  }
});


var routes = (
  <Router>
    <Route component={App} path="/">
    <IndexRoute component={OmgangPage}/>
    <Route name="spel" component={SpelPage} path="spel"></Route>
    <Route name="spelare" component={SpelarePage} path="spelare"></Route>
    <Route name="omgang" component={OmgangPage} path="omgang"></Route>
    </Route>
    </Router>
);

ReactDOM.render(
  routes, document.getElementById('main')
);

