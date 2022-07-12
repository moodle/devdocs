---
title: Starting a new language pack
sidebar_label: Language pack
sidebar_position: 4
tags:
  - Processes
  - Translation
  - Language
---

If Moodle is not yet translated into your language and you would like to help, please  [create an account on the Translation site](http://lang.moodle.org/login/signup.php) and contact our Moodle translation coordinator through [translation@moodle.org](mailto:translation@moodle.org).

Once your language pack has been set up, you can follow the instructions provided in [Maintaining a language pack](../maintaining.md).

First:

- **Make sure [langconfig](./langpack/langconfig) is properly set up**. It would be a very good idea to ask for other translators to double-check your translation of this extremely important file by posting a request in the [Translating Moodle forum](https://lang.moodle.org/mod/forum/view.php?id=5).
- Take a look at [Translation priority](./langpack/priority). All files have a rating according to how urgent they need translating.

If you have any questions about using AMOS, please post in the [Using AMOS forum](http://lang.moodle.org/mod/forum/view.php?id=5).

## Starting a child language of an existing language pack

If your country uses a variation of an existing language, that has a few (or many) differences from an [existing parent language](./langpack/langconfig) (for example, Canadian French is a variation of French, or US English has some spelling differences from UK English), a child language might be a good solution, as only the strings that need changes have to be uploaded to AMOS.

Some examples of existing child languages and the changes from the parent language for Moodle 4.0 are:

<!-- cspell:disable -->

- Català (Valencià) , 5465 changes from ca
- Dansk (kursus) , 22 changes from da
- Dansk Rum , 857 changes from da
- Davvisámegiella , 7235 changes from no
- Deutsch community , 246 changes from de_du
- Deutsch - Du , 1051 changes from de
- Deutsch - Kids , 273 changes from de_du
- English - Pirate , 1545 changes from en
- English for kids , 75 changes from en
- English - United States , 705 changes from en
- Español de México para niños , 140 changes from es_mx
- Español Venezuela , 157 changes from es
- Filipino , 945 changes from tl
- Finlandssvenska , 3049 changes from sv
- Français - Canada , 973 changes from fr
- Hebrew kids , 1284 changes from he
- Japanese kids ,  117 changes from ja.
- Kalaallisut , 561 changes from da
- Lithuanian (university) , 13414 changes from lt
- Lulesamisk , 8 changes from no
- Norsk , 798 changes from no
- Norsk - nynorsk , 3608 changes from no
- Sørsamisk , 8 changes from no
- Suomi+ , 983 changes from fi
- Wolof , 203 changes from fr

<!-- cspell:enable -->

:::info

If your local language only has a few differences from an existing language, it still qualifies as a different language for Moodle, and it can have its own language pack (if someone is willing to create and maintain it).

:::

## Defining the language code

<!-- cspell:ignore Tamazight -->

For historical reasons Moodle uses the [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) code for the representation of the language. If that doesn't exist, Moodle uses the [ISO639-3 code](https://en.wikipedia.org/wiki/List_of_ISO_639-3_codes) (for example, Moroccan Tamazight).

In some exceptional cases, like the Occitan languages, Moodle combines the [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) code with the [ISO 639-6](https://en.wikipedia.org/wiki/List_of_ISO_639-6_codes) code, for example, `oc_gsc` (keep in mind that the [ISO 639-6](https://en.wikipedia.org/wiki/List_of_ISO_639-6_codes) standard is [withdrawn](http://www.iso.org/iso/catalogue_detail?csnumber=43380)).

Other exceptions includes the `_kids` addition for language packs for very young children and some other exceptions. These exceptions should be kept to a minimum.
