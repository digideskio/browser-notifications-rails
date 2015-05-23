# browser-notifications-rails

A railtie for [yukimono/browser-notifications](https://github.com/yukimono/browser-notifications).

## requirements

* octicons
* bootstrap 2

## usage

in your `application.css` and `application.js`:

```
//= require browser-notifications-rails
```

see [yukimono/browser-notification/index.html](https://github.com/yukimono/browser-notifications/blob/d5ffb8de208852468e7370ee88bcc302ff9d5268/index.html) for a somewhat detailed javascript usage.

## custom colors

A sass mixin is provided to help stylize different colors. The usage is:

```scss
@import "browser-notifications/mixin";
atom-notifications.surprise {
  @include browser-notification(lighten(purple, 0.20), purple)
}
```

this will make notification with the type `surprise` purple.

the syntax is: `browser-notification(foreground, background)`
