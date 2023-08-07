---
title: Plugins adoption programme
sidebar_position: 9
tags:
  - Guidelines for contributors
  - Plugins
  - Plugin documentation
---
The Plugins adoption programme is a process for making it clear that a plugin is orphaned and is looking for a new maintainer. The programme is one of the mechanisms helping to minimise the risks of relying on additional plugins. The programme helps to find new maintainers for plugins whose original authors can't work on the plugin fully any more.

The programmes started in 2014 by announcing it in [a forum post](https://moodle.org/mod/forum/discuss.php?d=260354#p1128482) and since then, many plugins found their new maintainers since then through it.

### Motivation

Having an additional plugin installed at a Moodle site is always a risk. One of the essential aspects (apart from the code quality itself) that potential plugin users have to consider is how well the plugin is being maintained. Does the maintainer release regular updates and bug fixes? Is the plugin updated every six months for the new Moodle major release? Is there a place to report bugs and feature requests? And when reported, are they reflected?

It's not that difficult to write a new Moodle plugin these days. Many students do that as a part of their school or thesis projects, for example. But can one rely on the author of plugin to provide sufficient (or at least some) support for it? To be a responsible maintainer of a plugin is much harder than to be an author of it. Many maintainers work on their plugins in their free time. And even if they are lucky enough to be paid for doing that, it's just time consuming (as everything).

At certain moment, maintainers can realise they are not able to give enough love to their plugins any more. In the essay The Cathedral and the Bazaar, Eric Steven Raymond says

:::note

When you lose interest in a program, your last duty to it is to hand it off to a competent successor.

:::

And that is what Moodle plugins adoption programme is about.

### Programme rules for plugin maintainers

1. It is not a shame to give up on a plugin maintenance. Unmaintained plugin is worse than no plugin. We appreciate that you as the original author do not want to harm Moodle reputation just because your old code broke someone's site.
1. If you decide to offer your plugin for adoption, let the world know via posting into the [Plugins traffic forum](https://moodle.org/mod/forum/view.php?id=8149).
1. Your plugin will be put into a [special set in the Plugins directory](https://moodle.org/plugins/?q=set:maintainer-needed).
1. Once there is a volunteer who would like to take over the maintenance, please reply to the forum. It will help if the candidate proves their skills via a reference or a patch for existing issue etc. So we all know the plugin is passed over to good hands.
1. Finally, the successor is given the lead maintainer role for the plugin with all the permissions (edit the plugin record, release new versions etc). The previous maintainer will be still listed as the original author in the directory.

### Applying to become a maintainer

If you would like to become a new maintainer of a plugin that has been put up for the adoption, please reply to the relevant post in the [Plugins traffic forum](https://moodle.org/mod/forum/view.php?id=8149). It will help to demonstrate that you would be able to maintain the plugin - ideally with existing pull requests or other contributions to the plugin.

### Notes

- The `@author` tag in the phpDocs block of a file should never be changed even after the whole file is rewritten eventually. It's GPL legal statement, not a credits line.
- If the plugin was originally using Github as its repository, it is recommended to transfer the ownership of the repo. That way, all the reported issues in the github tracker, pull requests and all other information is kept.

### Forced adoption

As discussed in [MDLSITE-5354](https://tracker.moodle.org/browse/MDLSITE-5354), there are cases when a plugin becomes effectively orphaned due to maintainer's inactivity. In most cases, we can get in touch with the maintainer and agree on putting the plugin up for adoption. In rare cases when the maintainer can't be reached, the following procedure applies.

- Given that the maintainer has not logged in to the moodle.org site for 90 or more days
- When the maintainer does not reply to an email sent to their address (obtained from their moodle.org user profile, last commit message and tracker account) within a period of 30 days
- And the maintainer does not reply to a personal message sent to them via moodle.org messaging features within a period of 30 days
- Then plugins directory curators can consider the plugin maintainer disappeared and the plugin orphaned. It is then allowed to put the plugin up for adoption on behalf of the maintainer or assign it to another maintainer.

### Initiating forced adoption

If you are aware of a plugin that seems abandoned and you would like to help and become a new maintainer of it:

- Try to contact the current maintainer and let them know about this Plugins adoption programme. It is always better to have the plugin put for adoption by the current maintainers.
- If you do not get any response within a reasonable period, please publish your offer and intention via a new post in the [Plugins traffic forum](https://moodle.org/mod/forum/view.php?id=8149) to make the community aware of it.
- The plugins directory curators are subscribed to that forum and will be notified about your post there. They will help you with further process.
