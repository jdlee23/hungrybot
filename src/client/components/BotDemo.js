var React = require('react');
var axios = require('axios');

module.exports = React.createClass({
  getInitialState: function() {
    return {messages: []}
  },
  componentWillUpdate: function() {
    var node = this.refs.messagesContainer;
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
  },

  componentDidUpdate: function() {
    if (this.shouldScrollBottom) {
      var node = this.refs.messagesContainer;
      node.scrollTop = node.scrollHeight
    }
  },
  render: function() {
    return (
      <div>
        <h2 className="bot-header">Bot Demo</h2>
        <div ref="messagesContainer" className="chat-box">
          {this.state.messages.map(function(message) {
            return <div dangerouslySetInnerHTML={{__html: message}}></div>;
          })}
        </div>
        <form onSubmit={this.submitMessage}>
          <input ref="chatInput" className="chat-form form-control chat-input" autoComplete="off"/>
          <button className="btn btn-primary chat-btn">Send</button>
        </form>
      </div>
    );
  },
  submitMessage: function(evt) {
    evt.preventDefault();
    var input = this.refs.chatInput;

    var message = input.value;
    this.setState({messages: this.state.messages.concat(message)});

    axios.get('/bot/private?message=' + message).then(res => {
      this.setState({messages: this.state.messages.concat(res.data)});
    });

    input.value = '';
  }
});
