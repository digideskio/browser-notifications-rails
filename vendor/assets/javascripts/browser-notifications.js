/*
 *
 * This file has the following modules, and by extension sublicenses
 *
 * yukimono/browser-notifications:
 *   repository: https://github.com/yukimono/browser-notifications.git
 *   author(s): YUKI
 *   license: MIT
 *
 * atom/atom:
 *   repository: https://github.com/atom/atom/tree/0b34de005cfbff82c972830aa3bbe3938c7bec4f
 *   author(s): GitHub Inc.
 *   license: MIT
 *
 * atom/atom-dark-ui:
 *   repository: https://github.com/atom/atom-dark-ui/tree/0b19b33c64a4cec5289e0bdbf31d5322526a602e
 *   author(s): GitHub Inc.
 *   license: MIT
 *
 * atom/notifications:
 *   repository: https://github.com/atom/notifications/tree/ab03afe913df7e1dfbaee11a3201b3006bc440f2
 *   author(s): GitHub Inc.
 *   license: MIT
 *
 * stacktracejs/error-stack-parser:
 *   repository: git://github.com/stacktracejs/error-stack-parser.git
 *   maintainer(s): eriwen
 *   license: Public Domain
 *
 * github/octicons:
 *   repository: https://github.com/github/octicons.git
 *   author(s): GitHub
 *   maintainer(s): mschoening
 *   license: SIL OFL 1.1, MIT
 *
 */

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Generated by LiveScript 1.4.0
document.addEventListener('DOMContentLoaded', function(){
  var NotificationManager;
  NotificationManager = require('./lib/notifications.ls');
  window.atomNotifications = new NotificationManager;
  window.atomNotification = require("./lib/notification.ls");
  return document.dispatchEvent(new CustomEvent("notification:ready"));
});
},{"./lib/notification.ls":5,"./lib/notifications.ls":6}],2:[function(require,module,exports){
// Generated by LiveScript 1.4.0
var TemplateHelper, NotificationTemplate, MetaNotificationTemplate, ButtonListTemplate, ButtonTemplate, NotificationElement, addSplitLinesToContainer, addStackLinesToContainer, toString$ = {}.toString;
TemplateHelper = require('../template_helper.ls');
NotificationTemplate = "<div class=\"content\">\n  <div class=\"message item\"></div>\n  <div class=\"detail item\">\n    <div class=\"detail-content\"></div>\n    <a href=\"#\" class=\"stack-toggle\"></a>\n    <div class=\"stack-container\"></div>\n  </div>\n  <div class=\"meta item\"></div>\n</div>\n<div class=\"close\"></div>\n<div class=\"close-all btn btn-error\">Close All</div>";
MetaNotificationTemplate = "<div class=\"description\"></div>";
ButtonListTemplate = "<div class=\"btn-toolbar\"></div>";
ButtonTemplate = "<a href=\"#\" class=\"btn\"></a>";
NotificationElement = (function(superclass){
  var prototype = extend$((import$(NotificationElement, superclass).displayName = 'NotificationElement', NotificationElement), superclass).prototype, constructor = NotificationElement;
  prototype.metaTemplate = NotificationElement.metaTemplate = TemplateHelper.create(MetaNotificationTemplate);
  prototype.buttonListTemplate = NotificationElement.buttonListTemplate = TemplateHelper.create(ButtonListTemplate);
  prototype.buttonTemplate = NotificationElement.buttonTemplate = TemplateHelper.create(ButtonTemplate);
  prototype.animationDuration = 700;
  prototype.visibilityDuration = 5000;
  function NotificationElement(){}
  prototype.initialize = function(model){
    this.model = model;
    return this;
  };
  prototype.marked = function(content){
    return (typeof window.marked == 'function' ? window.marked(content) : void 8) || content;
  };
  prototype.render = function(){
    var detail, options, notificationContainer, stack, stackToggle, stackContainer, metaContent, metaContainer, description, buttons, toolbar, buttonClass, i$, len$, button, closeButton, closeAllButton, this$ = this;
    this.classList.add(this.model.getType().toString());
    this.classList.add("icon", this.model.getIconPrefix() + "", this.model.getIconPrefix() + "-" + this.model.getIcon());
    if (detail = this.model.getDetail()) {
      this.classList.add('has-detail');
    }
    if (this.model.isDismissable()) {
      this.classList.add('has-close');
    }
    if (this.model.getOptions().stack != null) {
      this.classList.add('has-stack');
    }
    this.setAttribute('tabindex', '-1');
    this.setAttribute('type', this.model.getType());
    this.innerHTML = NotificationTemplate;
    options = this.model.getOptions();
    if (options.duration != null && options.duration > 0) {
      this.visibilityDuration = options.duration;
    }
    this.querySelector(".close").classList.add("icon", this.model.getIconPrefix() + "", this.model.getIconPrefix() + "-" + this.model.getCloseIcon());
    notificationContainer = this.querySelector('.message');
    notificationContainer.innerHTML = this.marked(this.model.getMessage());
    if (detail = this.model.getDetail()) {
      addSplitLinesToContainer(this.querySelector('.detail-content'), detail);
      if (stack = options.stack) {
        stackToggle = this.querySelector('.stack-toggle');
        stackContainer = this.querySelector('.stack-container');
        addStackLinesToContainer(stackContainer, stack);
        stackToggle.addEventListener('click', function(e){
          return this$.handleStackTraceToggleClick(e, stackContainer);
        });
        this.handleStackTraceToggleClick({
          currentTarget: stackToggle
        }, stackContainer);
      }
    }
    if (metaContent = options.description) {
      this.classList.add('has-description');
      metaContainer = this.querySelector('.meta');
      metaContainer.appendChild(TemplateHelper.render(this.metaTemplate));
      description = this.querySelector('.description');
      if (this.model.getType() === 'fatal') {
        description.classList.add('fatal-notification');
      }
      description.innerHTML = this.marked(metaContent);
    }
    if (buttons = this.model.getButtons()) {
      if (toString$.call(buttons).slice(8, -1) === "Array") {
        this.classList.add('has-buttons');
        metaContainer = this.querySelector('.meta');
        metaContainer.appendChild(TemplateHelper.render(this.buttonListTemplate));
        toolbar = this.querySelector('.btn-toolbar');
        buttonClass = this.getButtonClass();
        for (i$ = 0, len$ = buttons.length; i$ < len$; ++i$) {
          button = buttons[i$];
          if (toString$.call(button).slice(8, -1) === "String") {
            button = NotificationElement.makeButton(button);
          }
          if (["DocumentFragment", "HTMLAnchorElement", "HTMLButtonElement"].indexOf(toString$.call(button).slice(8, -1)) === -1) {
            continue;
          }
          button.childNodes[0].classList.add(buttonClass);
          toolbar.appendChild(button);
        }
      }
    }
    if (this.model.isDismissable()) {
      closeButton = this.querySelector('.close');
      closeButton.addEventListener('click', function(){
        return this$.handleRemoveNotificationClick();
      });
    }
    closeAllButton = this.querySelector('.close-all');
    closeAllButton.classList.add(this.getButtonClass());
    return closeAllButton.addEventListener('click', function(){
      return this$.handleRemoveAllNotificationsClick();
    });
  };
  prototype.prepare = function(){
    if (!this.model.isDismissable()) {
      return this.autohide();
    }
  };
  prototype.getButtonClass = function(){
    var type;
    type = "btn-" + this.model.getType();
    if (type === 'btn-fatal') {
      return 'btn-error';
    } else {
      return type;
    }
  };
  prototype.removeNotification = function(){
    if (this.model.dismiss()) {
      return;
    }
    this.classList.add('remove');
    return this.removeNotificationAfterTimeout();
  };
  prototype.removeNotificationAfterTimeout = function(){
    var this$ = this;
    return setTimeout(function(){
      return this$.remove();
    }, this.animationDuration);
  };
  prototype.handleRemoveNotificationClick = function(){
    return this.removeNotification();
  };
  prototype.handleRemoveAllNotificationsClick = function(){
    var notifications, i$, len$, notification;
    notifications = window.atomNotifications.getNotifications();
    for (i$ = 0, len$ = notifications.length; i$ < len$; ++i$) {
      notification = notifications[i$];
      if (notification.isDismissable() && !notification.isDismissed() && notification.wasDisplayed()) {
        notification.getElement().removeNotification();
      }
    }
  };
  prototype.handleStackTraceToggleClick = function(e, container){
    if (typeof e.preventDefault == 'function') {
      e.preventDefault();
    }
    if (container.style.display === 'none') {
      e.currentTarget.innerHTML = "<span class=\"icon " + this.model.getIconPrefix() + " " + this.model.getIconPrefix() + "-" + this.model.getHideIcon() + "\"></span>Hide Stack Trace";
      return container.style.display = 'block';
    } else {
      e.currentTarget.innerHTML = "<span class=\"icon " + this.model.getIconPrefix() + " " + this.model.getIconPrefix() + "-" + this.model.getShowIcon() + "\"></span>Show Stack Trace";
      return container.style.display = 'none';
    }
  };
  prototype.autohide = function(){
    var this$ = this;
    return setTimeout(function(){
      if (this$ == null) {
        return;
      }
      return this$.removeNotification();
    }, this.visibilityDuration);
  };
  prototype.makeButton = NotificationElement.makeButton = function(label){
    var element;
    element = TemplateHelper.render(NotificationElement.buttonTemplate);
    element.childNodes[0].textContent = label;
    return element;
  };
  return NotificationElement;
}(HTMLElement));
addSplitLinesToContainer = function(container, content){
  var i$, ref$, len$, line, div;
  for (i$ = 0, len$ = (ref$ = content.split('\n')).length; i$ < len$; ++i$) {
    line = ref$[i$];
    div = document.createElement('div');
    div.classList.add('line');
    div.textContent = line;
    container.appendChild(div);
  }
};
addStackLinesToContainer = function(container, stack){
  var i$, len$, frame, div;
  for (i$ = 0, len$ = stack.length; i$ < len$; ++i$) {
    frame = stack[i$];
    div = document.createElement('div');
    div.classList.add('line');
    div.textContent = frame.toString();
    container.appendChild(div);
  }
};
module.exports = NotificationElement = document.registerElement('atom-notification', {
  prototype: NotificationElement.prototype
});
function extend$(sub, sup){
  function fun(){} fun.prototype = (sub.superclass = sup).prototype;
  (sub.prototype = new fun).constructor = sub;
  if (typeof sup.extended == 'function') sup.extended(sub);
  return sub;
}
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
},{"../template_helper.ls":7}],3:[function(require,module,exports){
// Generated by LiveScript 1.4.0
var NotificationsElement;
NotificationsElement = (function(superclass){
  var prototype = extend$((import$(NotificationsElement, superclass).displayName = 'NotificationsElement', NotificationsElement), superclass).prototype, constructor = NotificationsElement;
  function NotificationsElement(){}
  return NotificationsElement;
}(HTMLElement));
module.exports = NotificationsElement = document.registerElement('atom-notifications', {
  prototype: NotificationsElement.prototype
});
function extend$(sub, sup){
  function fun(){} fun.prototype = (sub.superclass = sup).prototype;
  (sub.prototype = new fun).constructor = sub;
  if (typeof sup.extended == 'function') sup.extended(sub);
  return sub;
}
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
},{}],4:[function(require,module,exports){
// Generated by LiveScript 1.4.0
var EventEmitter;
EventEmitter = (function(){
  EventEmitter.displayName = 'EventEmitter';
  var prototype = EventEmitter.prototype, constructor = EventEmitter;
  function EventEmitter(){
    this.events = {};
  }
  prototype.addEventListener = function(event, callback){
    var ref$;
    event = event.toLowerCase();
    (ref$ = this.events)[event] == null && (ref$[event] = []);
    return this.events[event].push(callback);
  };
  prototype.removeEventListener = function(event, callback){
    var ref$, index;
    event = event.toLowerCase();
    (ref$ = this.events)[event] == null && (ref$[event] = []);
    index = this.events[event].indexOf(callback);
    if (index > -1) {
      return this.events[event].splice(index, 1);
    }
  };
  prototype.emit = function(event, data){
    var payload, i$, ref$, len$, key;
    payload = {
      cancelable: true,
      detail: data
    };
    payload.__exposedProps__ = {};
    for (i$ = 0, len$ = (ref$ = Object.keys(data)).length; i$ < len$; ++i$) {
      key = ref$[i$];
      payload.__exposedProps__[key] = "r";
    }
    return this.dispatch(event, payload);
  };
  prototype.dispatch = function(event, payload){
    var ref$, this$ = this;
    event = EventEmitter.createEvent(event, payload);
    if (event.type.indexOf(":" > -1)) {
      document.dispatchEvent(event);
    }
    if ((ref$ = this.events[event.type.toLowerCase()]) != null) {
      ref$.forEach(function(callback){
        callback.call(this$, event);
      });
    }
    return event.defaultPrevented;
  };
  prototype.fireEvent = function(event, payload, cancelled){
    return cancelled = this.dispatch(event, payload);
  };
  prototype.dispatchEvent = function(event){
    return this.dispatch(event.type, event);
  };
  EventEmitter.createEvent = function(event, payload){
    var e;
    e = new document.defaultView.CustomEvent(event, payload);
    e.bubbles = false;
    e.cancelable = true;
    return e;
  };
  return EventEmitter;
}());
module.exports = EventEmitter;
},{}],5:[function(require,module,exports){
// Generated by LiveScript 1.4.0
var ErrorStackParser, EventEmitter, NotificationElement, Notification;
ErrorStackParser = require('error-stack-parser');
EventEmitter = require('./event_emitter.ls');
NotificationElement = require('./elements/notification-element.ls');
Notification = (function(superclass){
  var prototype = extend$((import$(Notification, superclass).displayName = 'Notification', Notification), superclass).prototype, constructor = Notification;
  function Notification(message, options, type, timestamp){
    this.message = message;
    this.options = options != null
      ? options
      : {};
    this.type = type != null ? type : "success";
    this.timestamp = timestamp != null
      ? timestamp
      : Date.now;
    Notification.superclass.call(this);
    this.read = false;
    this.dismissed = false;
    this.displayed = false;
    this.element = void 8;
    this.rect = void 8;
  }
  Notification.fromException = function(error, _options){
    var options;
    options = {
      stack: ErrorStackParser.parse(error),
      exception: error,
      dismissable: true,
      detail: error.name,
      description: error.message || error.name
    };
    if (_options != null) {
      import$(options, _options);
    }
    return new Notification(options.title || error.name, options, 'fatal');
  };
  prototype.onDidDismiss = function(callback){
    return this.on("notification:dismiss", callback);
  };
  prototype.onDidDisplay = function(callback){
    return this.on("notification:display", callback);
  };
  prototype.markAsRead = function(){
    return this.read = true;
  };
  prototype.markAsUnread = function(){
    return this.read = false;
  };
  prototype.dismiss = function(){
    var cancelled;
    if (!(this.isDismissable && !this.isDismissed())) {
      return false;
    }
    cancelled = this.emit('notification:dismiss', {
      notification: this
    });
    this.dismissed = !cancelled;
    if (cancelled) {
      this.emit('notification:dismiss:cancelled', {
        notification: this
      });
    } else {
      this.emit('notification:dismiss:passed', {
        notification: this
      });
    }
    return cancelled;
  };
  prototype.getTimestamp = function(){
    return this.timestamp;
  };
  prototype.isRead = function(){
    return this.read;
  };
  prototype.isDismissable = function(){
    return this.options.dismissable != null && this.options.dismissable;
  };
  prototype.isDismissed = function(){
    return this.dismissed;
  };
  prototype.wasDisplayed = function(){
    return this.displayed;
  };
  prototype.setDisplayed = function(displayed){
    var cancelled;
    displayed == null && (displayed = true);
    cancelled = false;
    if (displayed) {
      cancelled = this.emit('notification:display', {
        notification: this
      });
      if (!cancelled) {
        this.displayed = true;
      }
      if (cancelled) {
        this.emit('notification:display:cancelled', {
          notification: this
        });
      } else {
        this.emit('notification:display:passed', {
          notification: this
        });
      }
    } else {
      cancelled = this.emit('notification:undisplay', {
        notification: this
      });
      if (!cancelled) {
        this.displayed = false;
      }
      if (cancelled) {
        this.emit('notification:undisplay:cancelled', {
          notification: this
        });
      } else {
        this.emit('notification:undisplay:passed', {
          notification: this
        });
      }
    }
    return cancelled;
  };
  prototype.getIconPrefix = function(){
    return this.options.iconPrefix || "octicon";
  };
  prototype.setIconPrefix = function(iconPrefix){
    this.options.iconPrefix = iconPrefix;
  };
  prototype.getCloseIcon = function(){
    return this.options.closeIcon || "x";
  };
  prototype.setCloseIcon = function(closeIcon){
    this.options.closeIcon = closeIcon;
  };
  prototype.getShowIcon = function(){
    return this.options.showIcon || "plus";
  };
  prototype.setShowIcon = function(showIcon){
    this.options.showIcon = showIcon;
  };
  prototype.getHideIcon = function(){
    return this.options.hideIcon || "dash";
  };
  prototype.setHideIcon = function(hideIcon){
    this.options.hideIcon = hideIcon;
  };
  prototype.getIcon = function(){
    if (this.options.icon != null) {
      return this.options.icon;
    }
    switch (this.type) {
    case 'fatal':
      return 'bug';
    case 'error':
      return 'flame';
    case 'warning':
      return 'alert';
    case 'info':
      return 'info';
    case 'success':
      return 'check';
    }
  };
  prototype.getType = function(){
    return this.type;
  };
  prototype.setType = function(type){
    this.type = type;
  };
  prototype.getMessage = function(){
    return this.message;
  };
  prototype.setMessage = function(message){
    this.message = message;
  };
  prototype.getOptions = function(){
    return this.options;
  };
  prototype.setOptions = function(options){
    this.options = options;
  };
  prototype.mergeOptions = function(options){
    return import$(this.options, options);
  };
  prototype.getElement = function(){
    return this.element;
  };
  prototype.setElement = function(element){
    this.element = element;
  };
  prototype.getDetail = function(){
    return this.options.detail;
  };
  prototype.setDetail = function(detail){
    this.options.detail = detail;
  };
  prototype.addButton = function(label, classList){
    var ref$, button;
    label == null && (label = "");
    (ref$ = this.options).buttons == null && (ref$.buttons = []);
    button = NotificationElement.prototype.makeButton(label);
    if (classList != null) {
      button.childNodes[0].classList.add(classList);
    }
    this.options.buttons.push(button);
    return button;
  };
  prototype.removeButton = function(button){
    var ref$, index;
    (ref$ = this.options).buttons == null && (ref$.buttons = []);
    index = this.options.buttons.indexOf(button);
    if (index > -1) {
      return this.options.buttons.splice(index, 1);
    }
  };
  prototype.getButtons = function(){
    if (this.options.buttons != null && this.options.buttons.length > 0) {
      return this.options.buttons;
    }
  };
  prototype.getButton = Notification.getButton = function(fragment){
    return fragment.childNodes[0];
  };
  prototype.setRect = function(rect){
    this.rect = rect;
  };
  prototype.getRect = function(){
    return this.rect;
  };
  prototype.isEqual = function(model){
    if (model.getType() === this.getType()) {
      return true;
    }
    if (model.getMessage() === this.getMessage()) {
      return true;
    }
    if (JSON.stringify(model.getOptions() === JSON.stringify(this.getOptions()))) {
      return true;
    }
  };
  return Notification;
}(EventEmitter));
module.exports = Notification;
function extend$(sub, sup){
  function fun(){} fun.prototype = (sub.superclass = sup).prototype;
  (sub.prototype = new fun).constructor = sub;
  if (typeof sup.extended == 'function') sup.extended(sub);
  return sub;
}
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
},{"./elements/notification-element.ls":2,"./event_emitter.ls":4,"error-stack-parser":8}],6:[function(require,module,exports){
// Generated by LiveScript 1.4.0
var Notification, NotificationElement, NotificationsElement, Z, NotificationManager, toString$ = {}.toString;
Notification = require('./notification.ls');
NotificationElement = require('./elements/notification-element.ls');
NotificationsElement = require('./elements/notifications-element.ls');
Z = ['0 1.5px 4px rgba(0, 0, 0, 0.24), 0 1.5px 6px rgba(0, 0, 0, 0.12)', '0 3px 12px rgba(0, 0, 0, 0.23), 0 3px 12px rgba(0, 0, 0, 0.16)', '0 6px 12px rgba(0, 0, 0, 0.23), 0 10px 40px rgba(0, 0, 0, 0.19)', '0 10px 20px rgba(0, 0, 0, 0.22), 0 14px 56px rgba(0, 0, 0, 0.25)', '0 15px 24px rgba(0, 0, 0, 0.22), 0 19px 76px rgba(0, 0, 0, 0.3)'];
NotificationManager = (function(){
  NotificationManager.displayName = 'NotificationManager';
  var Disposable, prototype = NotificationManager.prototype, constructor = NotificationManager;
  function NotificationManager(){
    this.stack = [];
    this.isInitialized = false;
    this.duplicateTimeDelay = 500;
    this.lastNotification = void 8;
    this.notificationsElement = void 8;
    this.autoActivate = true;
    window.atomNotificationsCache == null && (window.atomNotificationsCache = []);
    this.safemode = true;
    this.z = 0;
    this.lastRect = 0;
    this.running = false;
  }
  prototype.setAutoActivate = function(autoActivate){
    this.autoActivate = autoActivate;
  };
  prototype.getAutoActivate = function(){
    return this.autoActivate;
  };
  prototype.initialize = function(parentNode){
    parentNode == null && (parentNode = document.body);
    if (this.isInitialized) {
      return;
    }
    this.notificationsElement = new NotificationsElement;
    parentNode.appendChild(this.notificationsElement);
    this.isInitialized = true;
    if (this.safemode) {
      if (this._turbolinks != null) {
        document.body.removeEventListener("page:load", this._turbolinks);
      }
      this._turbolinks = this.turbolinks();
      return document.body.addEventListener("page:load", this._turbolinks);
    }
  };
  prototype.turbolinks = function(){
    var this$;
    this$ = this;
    return function(){
      return this$.reapply();
    };
  };
  prototype.reapply = function(parentNode){
    parentNode == null && (parentNode = document.body);
    window.atomNotificationsCache.forEach(function(element){
      return document.body.appendChild(element);
    });
    return parentNode.appendChild(this.notificationsElement);
  };
  prototype.activate = function(parentNode){
    var this$ = this;
    if (this.running) {
      return;
    }
    this.running = true;
    this.initialize(parentNode);
    this.getNotifications().forEach(function(notification){
      return this$.addNotificationView(notification);
    });
    this.setDismissable();
    return this.running = false;
  };
  prototype.deactivate = function(){
    var ref$;
    if ((ref$ = this.notificationsElement) != null) {
      ref$.remove();
    }
    this.notificationsElement = void 8;
    this.isInitialized = false;
    if (this.safemode && this._turbolinks != null) {
      document.body.removeEventListener("page:load", this._turbolinks);
    }
    return this._turbolinks = void 8;
  };
  prototype.setDismissable = function(){
    var dismissable, this$ = this;
    this.notificationsElement.classList.remove('is-dismissable');
    dismissable = Array.prototype.slice.call(this.notificationsElement.children).some(function(notification){
      if (notification.model != null) {
        return notification.model.isDismissable();
      }
    });
    if (dismissable) {
      return this.notificationsElement.classList.add('is-dismissable');
    }
  };
  prototype.getNotificationRect = function(element){
    var rect;
    element.style.visibility = "hidden";
    element.style.pointerEvents = element.style.animation = element.style.transform = element.style.transition = "none";
    document.body.appendChild(element);
    rect = element.getBoundingClientRect();
    document.body.removeChild(element);
    element.style.visibility = element.style.pointerEvents = element.style.animation = element.style.transform = element.style.transition = "";
    return rect;
  };
  prototype.addNotificationView = function(notification){
    var timeSpan, element, this$, rect, masterRect;
    if (notification.wasDisplayed()) {
      return;
    }
    if (this.lastNotification != null) {
      timeSpan = Math.abs(notification.getTimestamp() - this.lastNotification.getTimestamp());
      if (timeSpan < this.duplicateTimeDelay && notification.isEqual(this.lastNotification)) {
        return;
      }
    }
    element = new NotificationElement;
    element.initialize(notification);
    this$ = this;
    notification.addEventListener("notification:dismiss:passed", function(){
      this$.lastRect -= this.getRect().height;
      this$.popNotification(this);
      if (this$.autoActivate && this$.notificationsElement != null && !this$.running) {
        return this$.activate();
      }
    });
    element.render();
    if (this.z > 0 && this.z < 6) {
      element.style.boxShadow = Z[this.z];
    }
    rect = this.getNotificationRect(element);
    notification.setRect(rect);
    if (this.lastRect > 0) {
      masterRect = this.notificationsElement.getBoundingClientRect();
      if (this.lastRect + rect.height > masterRect.height) {
        return false;
      }
    }
    this.lastRect += rect.height;
    element.prepare();
    notification.setDisplayed();
    this.notificationsElement.appendChild(element);
    notification.setElement(element);
    return this.lastNotification = notification;
  };
  prototype.addNotification = function(model){
    var this$ = this;
    if (toString$.call(model).slice(8, -1) === "Array") {
      return model.forEach(function(model){
        return this$.addNotification(model);
      });
    }
    model.markAsUnread();
    this.stack.push(model);
    if (this.autoActivate && this.notificationsElement != null && !this.running) {
      return this.activate();
    }
  };
  prototype.fetchNotification = function(){
    return this.stack.shift();
  };
  prototype.getNotification = function(){
    return this.stack[0];
  };
  prototype.fetchNotifications = function(n){
    n == null && (n = this.stack.length);
    return this.stack.splice(0, n);
  };
  prototype.getNotifications = function(n){
    n == null && (n = this.stack.length);
    return this.stack.slice(0, n);
  };
  prototype.popNotification = function(index){
    index == null && (index = 0);
    if (toString$.call(index).slice(8, -1) !== "Number") {
      index = this.stack.indexOf(index);
    }
    if (index > -1) {
      return this.stack.splice(index, 1);
    }
  };
  prototype.addNotificationByType = function(type, message, options){
    options == null && (options = {});
    return this.addNotification(new Notification(message, options, type));
  };
  prototype.addSuccess = function(message, options){
    return this.addNotificationByType('success', message, options);
  };
  prototype.addInfo = function(message, options){
    return this.addNotificationByType('info', message, options);
  };
  prototype.addWarning = function(message, options){
    return this.addNotificationByType('warning', message, options);
  };
  prototype.addError = function(message, options){
    return this.addNotificationByType('error', message, options);
  };
  prototype.addFatalError = function(message, options){
    if (typeof message === "string") {
      message = new Error(message);
    }
    return this.addNotification(Notification.fromException(message, options));
  };
  NotificationManager.Disposable = Disposable = (function(){
    Disposable.displayName = 'Disposable';
    var prototype = Disposable.prototype, constructor = Disposable;
    function Disposable(action){
      this.action = action;
    }
    prototype.dispose = function(){
      return this.action(this);
    };
    return Disposable;
  }());
  return NotificationManager;
}());
module.exports = NotificationManager;
},{"./elements/notification-element.ls":2,"./elements/notifications-element.ls":3,"./notification.ls":5}],7:[function(require,module,exports){
// Generated by LiveScript 1.4.0
var TemplateHelper;
TemplateHelper = {
  create: function(htmlString){
    var template;
    template = document.createElement('template');
    template.innerHTML = htmlString;
    document.body.appendChild(template);
    window.atomNotificationsCache == null && (window.atomNotificationsCache = []);
    window.atomNotificationsCache.push(template);
    return template;
  },
  render: function(template){
    return document.importNode(template.content, true);
  }
};
module.exports = TemplateHelper;
},{}],8:[function(require,module,exports){
(function (root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.
    if (typeof define === 'function' && define.amd) {
        define('error-stack-parser', ['stackframe'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('stackframe'));
    } else {
        root.ErrorStackParser = factory(root.StackFrame);
    }
}(this, function ErrorStackParser(StackFrame) {
    'use strict';

    var FIREFOX_SAFARI_STACK_REGEXP = /\S+\:\d+/;
    var CHROME_IE_STACK_REGEXP = /\s+at /;

    return {
        /**
         * Given an Error object, extract the most information from it.
         * @param error {Error}
         * @return Array[StackFrame]
         */
        parse: function ErrorStackParser$$parse(error) {
            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
                return this.parseOpera(error);
            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
                return this.parseV8OrIE(error);
            } else if (error.stack && error.stack.match(FIREFOX_SAFARI_STACK_REGEXP)) {
                return this.parseFFOrSafari(error);
            } else {
                throw new Error('Cannot parse given Error object');
            }
        },

        /**
         * Separate line and column numbers from a URL-like string.
         * @param urlLike String
         * @return Array[String]
         */
        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
            // Fail-fast but return locations like "(native)"
            if (urlLike.indexOf(':') === -1) {
                return [urlLike];
            }

            var locationParts = urlLike.replace(/[\(\)\s]/g, '').split(':');
            var lastNumber = locationParts.pop();
            var possibleNumber = locationParts[locationParts.length - 1];
            if (!isNaN(parseFloat(possibleNumber)) && isFinite(possibleNumber)) {
                var lineNumber = locationParts.pop();
                return [locationParts.join(':'), lineNumber, lastNumber];
            } else {
                return [locationParts.join(':'), lastNumber, undefined];
            }
        },

        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
            return error.stack.split('\n').slice(1).map(function (line) {
                var tokens = line.replace(/^\s+/, '').split(/\s+/).slice(1);
                var locationParts = this.extractLocation(tokens.pop());
                var functionName = (!tokens[0] || tokens[0] === 'Anonymous') ? undefined : tokens[0];
                return new StackFrame(functionName, undefined, locationParts[0], locationParts[1], locationParts[2]);
            }, this);
        },

        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
            return error.stack.split('\n').filter(function (line) {
                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP);
            }, this).map(function (line) {
                var tokens = line.split('@');
                var locationParts = this.extractLocation(tokens.pop());
                var functionName = tokens.shift() || undefined;
                return new StackFrame(functionName, undefined, locationParts[0], locationParts[1], locationParts[2]);
            }, this);
        },

        parseOpera: function ErrorStackParser$$parseOpera(e) {
            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
                return this.parseOpera9(e);
            } else if (!e.stack) {
                return this.parseOpera10(e);
            } else {
                return this.parseOpera11(e);
            }
        },

        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
            var lines = e.message.split('\n');
            var result = [];

            for (var i = 2, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(new StackFrame(undefined, undefined, match[2], match[1]));
                }
            }

            return result;
        },

        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
            var lines = e.stacktrace.split('\n');
            var result = [];

            for (var i = 0, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(new StackFrame(match[3] || undefined, undefined, match[2], match[1]));
                }
            }

            return result;
        },

        // Opera 10.65+ Error.stack very similar to FF/Safari
        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
            return error.stack.split('\n').filter(function (line) {
                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) &&
                    !line.match(/^Error created at/);
            }, this).map(function (line) {
                var tokens = line.split('@');
                var locationParts = this.extractLocation(tokens.pop());
                var functionCall = (tokens.shift() || '');
                var functionName = functionCall
                        .replace(/<anonymous function(: (\w+))?>/, '$2')
                        .replace(/\([^\)]*\)/g, '') || undefined;
                var argsRaw;
                if (functionCall.match(/\(([^\)]*)\)/)) {
                    argsRaw = functionCall.replace(/^[^\(]+\(([^\)]*)\)$/, '$1');
                }
                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ? undefined : argsRaw.split(',');
                return new StackFrame(functionName, args, locationParts[0], locationParts[1], locationParts[2]);
            }, this);
        }
    };
}));


},{"stackframe":9}],9:[function(require,module,exports){
(function (root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.
    if (typeof define === 'function' && define.amd) {
        define('stackframe', [], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.StackFrame = factory();
    }
}(this, function () {
    'use strict';
    function _isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function StackFrame(functionName, args, fileName, lineNumber, columnNumber) {
        if (functionName !== undefined) {
            this.setFunctionName(functionName);
        }
        if (args !== undefined) {
            this.setArgs(args);
        }
        if (fileName !== undefined) {
            this.setFileName(fileName);
        }
        if (lineNumber !== undefined) {
            this.setLineNumber(lineNumber);
        }
        if (columnNumber !== undefined) {
            this.setColumnNumber(columnNumber);
        }
    }

    StackFrame.prototype = {
        getFunctionName: function () {
            return this.functionName;
        },
        setFunctionName: function (v) {
            this.functionName = String(v);
        },

        getArgs: function () {
            return this.args;
        },
        setArgs: function (v) {
            if (Object.prototype.toString.call(v) !== '[object Array]') {
                throw new TypeError('Args must be an Array');
            }
            this.args = v;
        },

        // NOTE: Property name may be misleading as it includes the path,
        // but it somewhat mirrors V8's JavaScriptStackTraceApi
        // https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi and Gecko's
        // http://mxr.mozilla.org/mozilla-central/source/xpcom/base/nsIException.idl#14
        getFileName: function () {
            return this.fileName;
        },
        setFileName: function (v) {
            this.fileName = String(v);
        },

        getLineNumber: function () {
            return this.lineNumber;
        },
        setLineNumber: function (v) {
            if (!_isNumber(v)) {
                throw new TypeError('Line Number must be a Number');
            }
            this.lineNumber = Number(v);
        },

        getColumnNumber: function () {
            return this.columnNumber;
        },
        setColumnNumber: function (v) {
            if (!_isNumber(v)) {
                throw new TypeError('Column Number must be a Number');
            }
            this.columnNumber = Number(v);
        },

        toString: function() {
            var functionName = this.getFunctionName() || '{anonymous}';
            var args = '(' + (this.getArgs() || []).join(',') + ')';
            var fileName = this.getFileName() ? ('@' + this.getFileName()) : '';
            var lineNumber = _isNumber(this.getLineNumber()) ? (':' + this.getLineNumber()) : '';
            var columnNumber = _isNumber(this.getColumnNumber()) ? (':' + this.getColumnNumber()) : '';
            return functionName + args + fileName + lineNumber + columnNumber;
        }
    };

    return StackFrame;
}));

},{}]},{},[1])
