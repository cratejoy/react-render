var React = require('react');
var ReactDOMServer = require('react-dom/server');
var decache = require('decache');
var styledComponents = require('styled-components');

var Component = function Component(opts) {
  this.opts = opts;
  this.path = null;
  this.component = null;
};

Component.prototype.getPath = function getPath(cb) {
  if (this.path) {
    return cb(null, this.path);
  }
  if (!this.opts.path) {
    return cb(new Error('Component missing `path` property'));
  }
  this.path = this.opts.path;
  cb(null, this.path);
};

Component.prototype.getComponent = function getComponent(cb) {
  if (this.component) {
    return cb(null, this.component);
  }

  if (this.opts.component) {
    this.component = this.opts.component;
    return cb(null, this.component);
  }

  this.getPath(function(err, path) {
    if (err) return cb(err);

    if (!path) {
      return cb(new Error('Component options missing `path` and `component` properties'));
    }

    try {
      if (this.opts.noCache) {
        decache(this.path);
      }

      this.component = require(this.path);
      if (this.component && typeof this.component === 'object' && this.component.default) {
        this.component = this.component.default
      }
    } catch(err) {
      return cb(err);
    }

    cb(null, this.component);
  }.bind(this));
};

Component.prototype.renderToString = function renderToString(props, cb) {
  this.getComponent(function(err, component) {
    if (err) return cb(err);

    var sheet = new styledComponents.ServerStyleSheet();

    try {
      var markup = ReactDOMServer.renderToString(
        sheet.collectStyles(React.createElement(component, props))
      );
    } catch (err) {
      return cb(err);
    }

    // Add style tags
    markup = sheet.getStyleTags() + markup;

    cb(null, markup);
  }.bind(this));
};

Component.prototype.renderToStaticMarkup = function renderToStaticMarkup(props, cb) {
  this.getComponent(function(err, component) {
    if (err) return cb(err);

    try {
      var markup = ReactDOMServer.renderToStaticMarkup(React.createElement(component, props));
    } catch (err) {
      return cb(err);
    }

    cb(null, markup);
  }.bind(this));
};

module.exports = Component;
