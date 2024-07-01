---
title: Upgrade notes
---

Moodle encourages developers to note any important API changes which may impact other developers in that components Upgrade notes.

:::tip

The following advice applies to Moodle core code. Developers of third-party plugins can manage their upgrade notes any way they choose.

:::

Prior to Moodle 4.5, these upgrade notes are located in a file named `upgrade.txt`.
From Moodle 4.5 a new tool, `upgradenotes` has been created to help improve upgrade notes.

## Tips for writing good upgrade notes

- Consider the audience:
  - Upgrade notes are primarily intended for plugin developers looking for things that may break their plugins
- Look at similar notes and try to keep wording consistent
- Think about whether your change actually needs documenting in upgrade notes:
  - if your change is in a plugin then it probably does not have any public APIs
  - most bug fixes do not need to be noted unless they change an API
- When deprecating a feature, the replacement should also be mentioned. To put it another way: what developers want to know is the right way to do things in the future, so focus on explaining that.

## Using `upgradenotes`

<Since issueNumber="MDL-81125" version="4.5"/>

The `upgradenotes` tool is capable of performing two primary tasks:

- generating the content of a new upgrade note
- converting the upgrade notes and their metadata into Markdown

### Creating a new note

To create an upgrade note, you should use the `create` command:

```bash title="Creating a new note"
.grunt/upgradenotes.mjs create
```

This will ask you a series of questions and generate a YAML file which you should then check in to git.

You can also provide options to the tool to pre-fill some of these values, for example:

```bash
.grunt/upgradenotes.mjs create \
    -i MDL-99999 \
    -c core_communication \
    -t improved \
    -m "Added a new option to call the speaking clock"
```

All arguments are optional and any argument which is not valid will be presented as a question.

Full help is available for the command:

```bash title="Help creating an upgrade note"
.grunt/upgradenotes.mjs create -h
```

### Previewing upgrade notes

You can generate a preview of the upgrade notes using the `summmary` command:

```bash title="Generate a preview of the upgrade notes"
.grunt/upgradenotes.mjs summary
```

This will generate a series of `UPGRADING-CURRENT.md` files which contain the upgrade notes for the in-development version of Moodle since the last minor, or major, release. Files will be generated in:

- The document root (`/UPGRADING-CURRENT.md`) with upgrade notes for _all_ components; and
- Within each component which has anything to note.

If a component has an old copy of this file, this will be removed before any new file is generated.

:::note

These files are ignored by git and you do not need to check them in with your code. The Integration team will generate the weekly upgrade notes.

:::

### Generating upgrade notes for a release

:::tip

In typical development you will only ever need to create a new upgrade note. As part of the weekly integration cycle, and the release processes for both Minor and Major releases, the integration team will generate the markdown-formatted upgrade notes.

:::

For weekly releases a part of the release process involves updating the `UPGRADING.md` file using the `release` command:

```bash title="Generating release notes"
.grunt/upgradenotes.mjs release
```

:::tip

An optional `version` argument can also be provided, but this should not normally be necessary. If not specified, the version will default to the value in the Moodle `version.php` file.

:::

For a minor or major release, the `-d` argument should also be passed to remove all upgrade notes. This ensures that they are only added to a single Moodle version.

```bash
.grunt/upgradenotes.mjs release -d
```

## FAQ

### Which files should I check in to Git?

**Only the files in the `.upgradenotes` directory.**

You should not need to make any changes to the `upgrade.txt`, `UPGRADING.md`, or `UPGRADING-CURRENT.md` files.

When you run the `create` command you will generate a new file in the `.upgradenotes` directory. Only these files should be checked in to Git.

:::tip

You can use the following command to check in only the correct files:

```bash
git add .upgradenotes
```

:::

### Why is Moodle making this change?

This change is made in response to a number of issues with the current approach using `upgrade.txt` files, including:

- issues caused during rebasing and merging when a patch contains a change to a high-traffic `upgrade.txt` file;
- a lack of consistency and reliable markdown in the `upgrade.txt` approach;
- a lack of information to explain where a change came from (that is, an issue number); and
- increasing difficulties with discoverability due to upgrade notes being spread across the project.

By switching to a prompted and validated system we can ensure that relevant metadata is included, for example the issue number. By storing the data in a machine-readable file format (YAML) it can be processed in different ways to produce multiple output formats and files.

### What should I do about Moodle 4.4 and earlier?

For Moodle 4.4 and earlier the previous system of noting relevant changes in an `upgrade.txt` file will continue to be the only supported mechanism.
