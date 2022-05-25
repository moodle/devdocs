---
title: Contributing a translation
sidebar_label: Contributing
sidebar_position: 1
tags:
  - Processes
  - Translation
  - Language
---

The [Translation site](http://lang.moodle.org) enables translators to work collaboratively on language packs using a special Moodle translation tool called *AMOS*. If you see an error or non-translated term in Moodle in your language, you can contribute a correction or translation via the Translation site.

When contributing, the quality of your work is more important then the quantity. Make sure spelling, grammar, capitals and punctuation are correct. Only use terminology consistent with the rest of the language pack. Don't make mistakes in technical parts of the strings, like variable placeholders, html etc. For these reasons, using automatic translation (for example, Google Translate) is never good enough.

:::tip

If you'd like to help translating more than just a few strings, please contact the maintainer of your language pack as listed in the [Translation credits](http://lang.moodle.org/local/amos/credits.php). (If you don't receive a reply within a reasonable time, contact our Moodle translation coordinator through [translation@moodle.org](mailto:translation@moodle.org).)

:::

## Getting started with AMOS

1. [Create an account on the Translation site](http://lang.moodle.org/login/signup.php) and log in.
1. Click the link [AMOS translator](http://lang.moodle.org/local/amos/view.php).
1. In the **Languages** box, select your language.
1. In the **Components** box, find the language strings you wish to translate.
1. Click the button **Show strings**.
1. Type your translation into the boxes on the right. When you click out of the box, it will turn blue and your text will be saved automatically.
1. When you have finished translating, click the button at the bottom of the page **Go to the stage**. Do no more than 30 strings at a time.
1. Review your translation, then click the button **Send strings to language pack maintainers**.
1. (Optional) Add a message for the language pack maintainer explaining what you have done.

![Add your translation](_files/translate1.png)
![Submit your translation](_files/translate2.png)

:::important

You only need to contribute translations for **ONE version**, as the translations are added automatically to other versions when your contribution is accepted. Simply leave **Latest available version** ticked.

:::

## What happens next

The maintainer(s) of the language pack will receive notification of your contribution.  It will be reviewed and then most likely added to the language pack. You will receive email notification when the status of your contribution changes, that is, when a maintainer begins their review and then when they accept or reject it. At any time you can use the contribution record comments to communicate with the maintainer about your submitted translation.

In addition, your name will then appear on the  [Translation site](http://lang.moodle.org) front page as a recent, valued contributor. Well done!

Once you have three contributions accepted, you are listed as a contributor in the  [Translation credits](http://lang.moodle.org/local/amos/credits.php).

## Tips and Tricks

- If you are a bilingual (or multilingual) developer of a Moodle plugin, please send your strings of languages other than English to the language pack maintainer(s).
- Bear in mind that if a language pack maintainer gets a contribution with 250 strings of various modules, that is a nightmare to review :(
  - It is better to send contributions of a few strings at a time.
  - 30 strings of one module should really be the maximum, 10 strings from one module at a time is better :)
- Please note that **there are some things that should never be translated**, such as Moodle placeholders and HTML variables. See [Translation FAQ](./faq#are-there-items-which-are-not-to-be-translated)
- Please don't flood the language pack maintainer by sending the same strings more then once. If strings are in the contribution queue, they stay in the queue until the maintainer can review them.
- Never submit untranslated or half translated strings. Only good quality translations with checked spelling, correct punctuation, well formed sentences and consistent wording with the rest of the language pack are worth adding to the language pack.
- Never send strings that are translated already without improving them, for example, by blindly uploading offline translated strings.
- Avoid a mix of newly translated strings and improved strings.

## See also

- [AMOS manual](./amos) for further information about the AMOS translation toolkit
- [Video on how to contribute to a language pack](http://www.youtube.com/watch?v=XClUZOuFfWo|)
- [Improving English language strings](https://docs.moodle.org/dev/Improving_English_language_strings)
