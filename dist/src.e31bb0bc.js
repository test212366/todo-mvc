// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"blocks/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomSort = void 0;

const randomSort = (array, item) => {
  array.sort(() => Math.random() - 0.5);
  array.forEach(letter => {
    item += letter;
  });
  return item;
};

exports.randomSort = randomSort;
},{}],"blocks/model.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = void 0;

var _controller = require("./controller");

class Model {
  constructor(titleCard, passwordCard, basicCash = 1000) {
    this._titleCard = titleCard;
    this._passwordCard = passwordCard;
    this._basicCash = basicCash;
  }

  async submitCard(user) {
    await fetch('https://atm-automat-default-rtdb.europe-west1.firebasedatabase.app/cards.json', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async preparingData(password, title) {
    const resp = await fetch('https://atm-automat-default-rtdb.europe-west1.firebasedatabase.app/cards.json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const responce = await resp.json();

    try {
      this.preparingDataResponce(responce, password, title);
    } catch {
      return;
    }
  }

  preparingDataResponce(responce, password, title) {
    for (const key in responce) {
      if (Object.hasOwnProperty.call(responce, key)) {
        const element = responce[key];

        if (element._passwordCard === password && element._titleCard === title) {
          const controller = new _controller.Controller();
          controller.preparingDataCardDisplay(element);
          console.log('вход успешен');
        }
      }
    }
  }

}

exports.Model = Model;
},{"./controller":"blocks/controller.js"}],"blocks/controller.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Controller = void 0;

var _model = require("./model");

var _view = require("./view");

class Controller {
  constructor() {}

  preparingDataCard(titleCard, password) {
    this.model = new _model.Model(titleCard, password);
    this.model.submitCard(this.model);
  }

  preparingDataAll(password, title) {
    const model = new _model.Model();
    model.preparingData(password, title);
  }

  preparingDataCardDisplay(card) {
    const view = new _view.View();
    view.updateDisplayStart(card);
  }

}

exports.Controller = Controller;
},{"./model":"blocks/model.js","./view":"blocks/view.js"}],"blocks/view.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _utils = require("./utils");

var _controller = require("./controller");

class View {
  constructor() {
    document.body.addEventListener('click', e => {
      e.preventDefault();

      switch (e.target.className) {
        case 'button-li':
          this.printText(e.target.textContent);
          break;

        case 'input':
          this.currentInput = e.target;
          break;

        case 'btn random':
          this.randomPassword();
          break;

        case 'btn createCard':
          const $passwordReg = document.getElementById('passwordReg'),
                $titleCardReg = document.getElementById('titleCardReg');

          if ($passwordReg.value && $titleCardReg.value && $passwordReg.value.length > 5 && $titleCardReg.value.length > 9) {
            this.controller = new _controller.Controller();
            this.controller.preparingDataCard($titleCardReg.value, $passwordReg.value);
            this.currentInput = '';
            $passwordReg.value = '';
            $titleCardReg.value = '';
          } else {
            this.currentInput = '';
            $passwordReg.value = '';
            $titleCardReg.value = '';
          }

          break;

        case 'btn haveCard':
          this.$registration = document.querySelector('.screen__registration-card');
          this.$autorization = document.querySelector('.screen__autorization-card');
          this.$registration.style.display = 'none';
          this.$autorization.style.display = 'block';
          break;

        case 'btn regist':
          this.$registration.style.display = 'block';
          this.$autorization.style.display = 'none';
          break;

        case 'btn confirm':
          const $titleCardAuto = document.getElementById('titleCardAuto'),
                $passwordAuto = document.getElementById('passwordAuto');

          if ($passwordAuto.value && $titleCardAuto.value && $passwordAuto.value.length > 5 && $titleCardAuto.value.length > 9) {
            const cont = new _controller.Controller();
            cont.preparingDataAll($passwordAuto.value, $titleCardAuto.value);
            this.currentInput = '';
            $passwordAuto.value = '';
            $titleCardAuto.value = '';
          } else {
            this.currentInput = '';
            $passwordAuto.value = '';
            $titleCardAuto.value = '';
          }

          break;

        case 'btn difrMCard':
          const $setMCard = document.querySelector('.screen__display-setMCard');
          $setMCard.style.display = 'block';
          break;

        default:
          break;
      }
    });
  } //start display and view data card in display


  updateDisplayStart(card) {
    const $registration = document.querySelector('.screen__registration-card'),
          $autorization = document.querySelector('.screen__autorization-card'),
          $display = document.querySelector('.screen__display'),
          $balance = document.querySelector('.screen__display-balance');
    const $startSetMCard = document.querySelector('.startSetMCard');
    $display.style.display = 'block';
    $balance.textContent = `Ваш баланс на карте: ${card._basicCash}`;
    $registration.style.display = 'none';
    $autorization.style.display = 'none';
    $startSetMCard.addEventListener('click', () => {
      const $setMcardSum = document.querySelector('.setMcardSum'),
            $setMcardNumber = document.querySelector('.setMcardNumber');

      if ($setMcardSum.value <= card._basicCash) {
        if ($setMcardNumber.value.length > 9) {
          card._basicCash -= $setMcardSum.value; //сделать отображение на сервере. уменьшение _basicCash

          $balance.textContent = `Ваш баланс на карте: ${card._basicCash}`;
          console.log(card);
        }

        $setMcardNumber.value = '';
        $setMcardSum.value = '';
        return;
      } else {
        $setMcardNumber.value = '';
        $setMcardSum.value = '';
        return;
      }
    });
  } //this.currentInput have current input, and when user click keyboard, currentInput.value += button.textContent


  printText(text) {
    if (text === 'Дом' || text === '<') return;
    this.currentInput.value += text;
  } //random sort password and view div and input


  randomPassword() {
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let password = '';
    password = (0, _utils.randomSort)(array, password);
    const $titleGeneration = document.querySelector('.title'),
          $passwordReg = document.getElementById('passwordReg');
    $titleGeneration.textContent = `Новый пароль: ${password}`;
    $passwordReg.value = password;
  }

}

exports.View = View;
},{"./utils":"blocks/utils.js","./controller":"blocks/controller.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _view = require("./blocks/view");

const view = new _view.View();
},{"./blocks/view":"blocks/view.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "28608" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map