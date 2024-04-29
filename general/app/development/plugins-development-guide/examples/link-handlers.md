---
title: Link Handlers
tags:
  - Moodle App
---

You can create a link handler to intercept what happens when links are clicked using the [CoreContentLinksDelegate](../api-reference.md#corecontentlinksdelegate).

The Moodle app automatically creates two link handlers for module plugins, so you don't need to create them in your plugin's JavaScript code anymore:

- A handler to treat links to `mod/pluginname/view.php?id=X`. When this link is clicked, it will open your module in the app.
- A handler to treat links to `mod/pluginname/index.php?id=X`. When this link is clicked, it will open a page in the app listing all the modules of your type inside a certain course.

If these aren't sufficient, link handlers have some advanced features that allow you to change how links behave under different conditions.

In order to implement a custom link handler, you should register an object implementing the [CoreContentLinksHandler interface](https://github.com/moodlehq/moodleapp/blob/main/src/core/features/contentlinks/services/contentlinks-delegate.ts#L27..L95) in the delegate. You can also achieve this extending the [CoreContentLinksHandlerBase class](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/contentlinks/classes/base-handler.ts):

```js
class AddonModFooLinkHandler extends this.CoreContentLinksHandlerBase {}

this.CoreContentLinksDelegate.registerHandler(new AddonModFooLinkHandler());
```

## Using patterns

You'll most likely need to match only certain links. You can define a Regular Expression pattern to filter clicks:

```js
class AddonModFooLinkHandler extends this.CoreContentLinksHandlerBase {

    constructor() {
        super();

        this.pattern = RegExp('\/mod\/foo\/specialpage.php');
    }

}
```

## Setting a priority

Multiple link handlers may apply to a given link. You can define the order of precedence by setting the priority; the handler with the highest priority will be used.

Handlers have a priority default priority of 0, so 1 or higher will override the default:

```js
class AddonModFooLinkHandler extends this.CoreContentLinksHandlerBase {

    constructor() {
        super();

        this.priority = 1;
    }

}
```

## Performing multiple actions

Once a link has been matched, the handler's `getActions()` method determines what the link should do. This method has access to the URL and its parameters.

Different actions can be returned depending on different conditions:

```js
class AddonModFooLinkHandler extends this.CoreContentLinksHandlerBase {

    getActions(siteIds, url, params) {
        return [
            {
                action: function(siteId, navCtrl) {
                    // The actual behaviour of the link goes here.
                },
                sites: [
                    // ...
                ],
            },
            {
                // ...
            },
        ];
    }

}
```

Once handlers have been matched for a link, the actions will be fetched for all them and sorted by priority. The first valid action will be used to open the link.

If your handler is matched with a link, but a condition assessed in the `getActions()` method determines that you want to skip it, you can invalidate it by setting its sites property to an empty array.

## Complex example

This will match all URLs containing `/mod/foo/`, and force those with an id parameter that's not in the `supportedModFoos` array to open in the user's browser, rather than the app:

```js
const that = this;
const supportedModFoos = [...];

class AddonModFooLinkHandler extends this.CoreContentLinksHandlerBase {

    constructor() {
        super();

        this.pattern = new RegExp('\/mod\/foo\/');
        this.name = 'AddonModFooLinkHandler';
        this.priority = 1;
    }

    getActions(siteIds, url, params) {
        const action = {
            action() {
                that.CoreUtilsProvider.openInBrowser(url);
            },
        };

        if (supportedModFoos.indexOf(parseInt(params.id)) !== -1) {
            action.sites = [];
        }

        return [action];
    }

}

this.CoreContentLinksDelegate.registerHandler(new AddonModFooLinkHandler());
```
