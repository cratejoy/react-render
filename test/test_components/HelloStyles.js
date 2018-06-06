var React = require('react');
var createReactClass = require('create-react-class');
var styled = require('styled-components').default;

var StyledDiv = styled.div([ 'color:darkslategray;' ]);

var HelloStyles = createReactClass({
  render: function() {
    return React.createElement(StyledDiv, null, "Hello ", this.props.name);
  }
});

module.exports = HelloStyles;
