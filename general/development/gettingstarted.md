---
title: Getting started
tags:
  - Core development
  - Processes
---

:::info Ready to code?

- [Set up your development environment](#a-quick-start-to-moodle-development)
- See the [list of relatively easy Moodle bugs](https://tracker.moodle.org/issues/?jql=project%20%3D%20MDL%20AND%20type%20in%20(bug)%20AND%20status%20%3D%20open%20AND%20Difficulty%20%3D%20Easy%20AND%20labels%20not%20in%20(patch)%20ORDER%20BY%20created%20DESC)
- Read our guide to making [a better contribution](./abc.md)
- [Prepare a patch](/docs/guides/git/#preparing-a-patch)
- Read the [Coding style](./policies/codingstyle/index.md) policy
- Send your patch to [peer review](./process/peer-review/index.md) and learn more about the [Moodle processes](./process.md).
- Create your custom plugins looking at the information in the [Plugin contribution](../community/plugincontribution/index.md) page.

:::

<!-- cspell:ignore adminer -->

## A quick start to Moodle development

1. Create an account on [Moodle.org](https://moodle.org/). You will need this to access the [Moodle General Developer forum](https://moodle.org/mod/forum/view.php?f=33) and download [Moodle plugins](https://moodle.org/plugins). You can also sign up to free self-paced courses in our [Moodle Academy Developer Learning Pathway](https://moodle.academy/course/index.php?categoryid=4)
1. Create an account on [GitHub](https://github.com/) and [install Git on your computer](/docs/guides/git/). This is the source code version control repository tool of choice for Moodle development.
1. [Install Moodle on your machine](https://docs.moodle.org/en/Installing_Moodle) or use a container environment like [moodle-docker](https://github.com/moodlehq/moodle-docker). You can also use [Moodle Development Kit (MDK)](./tools/mdk.md).

  :::tip

  We highly recommend that you use a database administration tool such as [adminer](https://www.adminer.org/) to help you manage your development databases.

  :::

1. Set-up Moodle for development:

- Enable the [Moodle Debugger](https://docs.moodle.org/en/Debugging).

  :::tip

  When developing in Moodle, it's recommended to turn debugging on. Only turn it off for demonstration purposes as it does have a considerable impact on the performance of your Moodle website.

  :::

  :::danger Attention

  Always resolve all errors and warnings that show up with **Moodle debugging turned on**. Errors and warnings imply that something isn't working as it is supposed to which means your code isn't doing what you intended it to, or may be fragile and could break in the future.

  :::

- Install the [Moodle PHP CodeSniffer](./tools/phpcs.md). This will be used to test your plugin for conformance with Moodle coding standards. Use this to develop good coding skills.
- Install the Moodle [PHPdoc check plugin](https://moodle.org/plugins/local_moodlecheck). This will be used to test your source code documentation. This will also help improve your coding skills.

  :::info Advanced

  You can use Xdebug to enable step-by-step debugging in PHP. Integrations are built into many popular editors.
  [Learn more](/docs/guides/profiling/#xdebug)

  :::

And finally remember these wise words from [Michael Milette](https://moodle.org/user/view.php?id=1615960&course=5) in the [General developer forum](https://moodle.org/mod/forum/discuss.php?d=355789):

> Learning how to code in Moodle involves a lot of learning by example and reading other people's source code including Moodle core code. If you have a particular type of plugin in mind that you would like to create, it's recommended that you start by finding a plugin which provides similar functionality and use the process outlined above to clone it. Then customize it to suit your needs. You can even do this with 3rd party plugins found on the [plugins directory](https://moodle.org/plugins). That's just one of the many advantages of developing with open source. Just always remember to give credit to the original author for his/her original hard work. [...]
>
> Learning all of Moodle and its database takes time - maybe even years. In fact you may never come across parts of it and that's OK. Take it one step at a time and don't be afraid to ask for help when you get stuck. The only expectation by the worldwide community is that you will have tried to figure things out on your own before asking a question. Google is your friend. Just start your query with the word "moodle".

## Communication

If you have any question or want to share your ideas, there are several channels you can use to communicate with other developers:

- [Moodle community forums](https://moodle.org/course/), available in different languages.
- [A Matrix room](https://matrix.to/#/%23moodledev:moodle.com) available for real-time communication. Read the [chat policies](https://docs.moodle.org/dev/Chat) before joining.
- [Developer meetings](../community/meetings/index.md), organised periodically and open to anyone interested in Moodle development.

## Developer FAQ

Visit our [Developer FAQ](./abc/faq.md) page and get answers to some of our most common questions.

## See also

- [Releases](../releases.md) - versions of Moodle that have already been released
- [Process](./process.md)
- [API guides](/docs/apis)
- [Contributing](../community/contribute.md)
- [A (july 2017) forum thread](https://moodle.org/mod/forum/discuss.php?d=355789) about Getting Started with Moodle Development.
