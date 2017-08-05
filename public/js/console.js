(function(window) {
  window.console = window.console || {};
  var messages = [], isConnected = false;
  var socket = null;
  /**
   * 初始化
   * @param {String} token
   */
  window.console.init = function(token) {
    socket = io('https://jsconsole.org?token=' + token);
    socket.on('connect', function() {
      isConnected = true;
      window.console.handleConnected();
    });
    socket.on('disconnect', function() {
      isConnected = false;
    });
  };
  /**
   * 连接成功
   */
  window.console.handleConnected = function() {
    while (messages.length > 0) {
      var message = messages.splice(0, 1)[0];
      socket.emit('log', message.message, message.level);
    }
  };

  /**
   * 发送日志
   * @param message
   * @param level
   */
  window.console.log = function(message, level) {
    var item = { message: message, level: level };
    if (!isConnected) {
      messages.push(item);
      return;
    }
    socket.emit('log', item.message, item.level);
  };
  // 处理其他的
  var levels = ['trace', 'debug', 'info', 'warn', 'error'];
  levels.forEach(function(level) {
    window.console[level] = function(message) {
      window.console.log(message, level);
    };
  });
})(window);