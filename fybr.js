"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var Fybr = {};

Fybr.createNew = function (fybr, shouldSelfTerminate) {
  var blob = new Blob(["self.onmessage = args => {\n            const fybr = async ".concat(fybr.toString(), ";\n            const shouldSelfTerminate = ").concat(shouldSelfTerminate, ";\n            if(shouldSelfTerminate) {\n                const asyncTerminate = async () => {\n                    await fybr(postMessage, args.data);\n                    self.close();\n                }\n                asyncTerminate();\n            } else {debugger;\n                fybr(postMessage, args.data);\n                self.close();\n            }\n        }")], {
    type: 'text/javascript'
  });
  return blob;
};

Fybr.connect = function (fybr) {
  var thread = new Worker(URL.createObjectURL(fybr));
  return {
    "start": function start() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return onStart(args, thread);
    },
    "onError": thread.onerror,
    "terminate": thread.terminate,
    "listen": function listen(func) {
      return onListen(func, thread);
    },
    "type": "fybrConnection"
  };
};

var onStart = function onStart(args, thread) {
  thread.postMessage(args);
};

var onListen = function onListen(func, thread) {
  thread.onmessage = function (evt) {
    return func({
      "data": evt.data,
      "isTrusted": evt.isTrusted,
      "returnVal": evt.returnValue,
      "timeStamp": evt.timeStamp,
      "type": "fybrData"
    });
  };
};

var _default = Fybr;
exports.default = _default;