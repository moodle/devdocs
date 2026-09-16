---
title: Colour modes
tags:
  - Theme
  - Styles
  - CSS
  - Accessibility
  - Bootstrap
description: How to make sure that your plugin renders correctly in the Boost theme's light and dark colour modes
---

<Since version="5.3" issueNumber="MDL-68037" />

The Boost theme can render a site in either a light or a dark colour mode. Boost itself and the core interface follow the mode, but a plugin only follows it if its own styles take their colours from the theme. A plugin which hardcodes a colour keeps that colour in both modes, which usually means a light island on a dark page, or text which cannot be read against the surface behind it.

This page describes how the colour modes work, and what a plugin has to do in order to render correctly in both of them.

:::info[Colour modes are experimental]

Colour modes are turned off until a site opts in, precisely because a plugin which has not been checked yet can still draw its pages in light colours. Do not assume that your users have the feature switched on, and do not assume that they never will.

:::

## How Boost renders a colour mode

Boost uses the [Bootstrap 5.3 colour modes API](https://getbootstrap.com/docs/5.3/customize/color-modes/). Two attributes are written to the `html` tag:

- `data-bs-theme` holds the mode the page is actually rendered in, either `light` or `dark`. Every Bootstrap colour mode override, and every override in Boost, is scoped to this attribute.
- `data-colourmode` holds the mode the person chose, which may also be `auto`. It exists because `auto` can only be resolved by the browser.

The mode is decided server side, so that pages arrive in the right colours rather than flashing white first. Where the choice is `auto`, a small script in the page head resolves it against `prefers-color-scheme` before the page is painted, and keeps listening so that a device which changes its colour scheme while the page is open is followed.

The chosen mode is stored in the `theme_boost_colourmode` user preference, and mirrored into a cookie of the same name so that a page which nobody is logged in to, the login page above all, can be rendered in it rather than reverting to the site default. Guests and users who are not logged in cannot store a preference, so they get the site default and no switcher.

`theme_boost\colour_mode` is the entry point for all of this:

| Method | Returns |
| --- | --- |
| `colour_mode::is_enabled()` | Whether colour modes are turned on for this site |
| `colour_mode::get_current_mode()` | The mode for the current page: `light`, `dark` or `auto` |
| `colour_mode::get_site_default()` | The mode used by people who have not chosen one |
| `colour_mode::can_choose_mode()` | Whether the current user can pick their own mode |
| `colour_mode::render_menu($output)` | HTML for the navbar switcher, or an empty string |

:::warning[Style against `data-bs-theme`, never against `prefers-color-scheme`]

The colour mode is a Moodle setting first and a device setting second: the site default and the user preference both override what the device reports. A style keyed off `@media (prefers-color-scheme: dark)` will therefore be applied on a light page whenever a user has picked light on a dark device, and skipped on a dark page whenever they have picked dark on a light one.

Always scope to the attribute instead:

```css
[data-bs-theme="dark"] .my-plugin-panel {
    /* ... */
}
```

:::

## Turning colour modes on while you develop

1. Set the site theme to Boost, or to a theme which has Boost as a parent.
1. Go to _Site administration > Appearance > Themes > Boost_, and open the **Experimental settings** tab.
1. Tick **Enable colour modes** (`theme_boost | enablecolourmodes`).
1. Optionally set **Default colour mode** to `Dark`, so that everything you look at is in dark mode, including the pages you are not logged in to.

A switcher then appears in the navbar for logged in users, offering Light, Dark and System.

## Where colours come from

In order of preference:

1. **Do not set a colour at all.** Most of the interface can be built out of Bootstrap components and utility classes, which already follow the mode. This is the least code and the least maintenance, and it is what the [plugin contribution checklist](/general/community/plugincontribution/checklist#css-styles) has always asked for.
1. **Use a utility class.** `bg-body`, `bg-body-secondary`, `bg-body-tertiary`, `text-body`, `text-body-secondary`, `text-body-emphasis`, `text-bg-*` and `border` all take their colours from custom properties which change with the mode. Prefer these to `bg-white`, `bg-light`, `text-dark` and `text-white`, which name a colour rather than a role. Boost does re-point `.bg-white` and `.bg-light` in dark mode, because core uses them to mean "a raised surface" and "a recessed one", so existing markup keeps working. `.text-dark` is not re-pointed, though, other than on `.bg-light`: it is dark text, and it is correct only where the fill under it does not follow the mode.
1. **Use a custom property.** Where you do need CSS of your own, take the value from one of the properties listed below rather than writing a literal.
1. **Write a literal, and correct it for dark mode.** Only where the colour genuinely has to differ between the two modes.

### Custom properties which follow the mode

These are the Bootstrap properties most useful to a plugin. The values shown are those of the default Boost preset.

| Property | Light | Dark | Use it for |
| --- | --- | --- | --- |
| `--bs-body-bg` | `#f8f9fa` | `#1d2125` | The page itself |
| `--bs-body-color` | `#1d2125` | `#dee2e6` | Body text |
| `--bs-emphasis-color` | `#000000` | `#ffffff` | Text which needs more contrast than the body |
| `--bs-secondary-color` | `rgba(29, 33, 37, .75)` | `rgba(222, 226, 230, .75)` | Muted text |
| `--bs-white` | `#ffffff` | `#343a40` | A raised surface: a card, a modal, a dropdown |
| `--bs-secondary-bg` | `#e9ecef` | `#343a40` | A surface one step from the page |
| `--bs-tertiary-bg` | `#f8f9fa` | `#292e33` | A recessed surface: a drawer, a striped row |
| `--bs-border-color` | `#dee2e6` | `#495057` | Borders and rules |
| `--bs-link-color` | `#0f6cbf` | `#7baedc` | Links |
| `--bs-gray-100` … `--bs-gray-900` | The light ramp | The ramp reordered for a dark page | Greys |
| `--bs-black` | `#000000` | `#f8f9fa` | Text at maximum contrast |

The [Moodle Design System](/general/designsystem/overview) tokens follow the mode as well, and are the better choice where your markup already uses design system components:

| Token | Light | Dark | Use it for |
| --- | --- | --- | --- |
| `--mds-bg-surface-default` | `#ffffff` | `#343a40` | A raised surface |
| `--mds-bg-surface-subtle` | `#f8f9fa` | `#292e33` | A recessed surface |
| `--mds-text-default` | `#1d2125` | `#dee2e6` | Body text |
| `--mds-text-subtle` | `#495057` | `#ced4da` | Secondary text |
| `--mds-text-muted` | `#6a737b` | `#ced4da` | Muted text |
| `--mds-border-default` | `#dee2e6` | `#495057` | Borders |

:::danger[`--bs-body-bg` is not white]

Boost's page background is `$gray-100`, not white, so `--bs-body-bg` resolves to `#f8f9fa` in light mode. Swapping a hardcoded `#fff` for `var(--bs-body-bg)` therefore changes light mode as well as fixing dark mode: the element stops standing out from the card behind it.

For anything which means "a surface raised above the page", use `var(--bs-white)` or `var(--mds-bg-surface-default)`. Keep `--bs-body-bg` for things which genuinely are the page.

:::

:::note[The dark greyscale is not an inversion]

In light mode a raised surface is white and the page behind it is grey. In dark mode the order is not simply reversed: the page is the darkest, a recessed surface is a little lighter, and a raised surface is lighter still. So `--bs-white` is *lighter* than `--bs-body-bg` in both modes, and a rule which reaches for "the darker grey" to mean "raised" will be wrong in one of them.

:::

## Auditing your plugin

Start by finding every colour your plugin names for itself:

```bash
grep -rniE '(#[0-9a-f]{3,8}|rgba?\(|hsla?\(|: *(white|black|silver|gray|grey|whitesmoke))' styles.css
```

Then check your templates and your JavaScript for:

- `bg-white`, `bg-light`, `text-dark`, `text-white` and `text-black` classes.
- `style="..."` attributes which set a colour.
- Colours passed into a chart, a canvas, or an inline SVG from PHP or JavaScript.
- Images and icons with a colour baked into the file, covered in [Icons and images](#icons-and-images) below.

Finally, look at each page of your plugin in both modes with the switcher, and read the result rather than trusting the diff. A rule can be perfectly correct in isolation and still fail because of the rule it sits next to.

## Rules of thumb

### A literal colour is a problem when it is only half of a pair

A colour is rarely wrong on its own. It goes wrong when it is fixed and the thing next to it moves: a fixed light background behind text which follows the mode, or fixed dark text on a surface which follows the mode. Either way the pair loses its contrast.

<InvalidExample title="Don't: a fixed background under text which moves">

```css
.my-plugin-panel {
    /* The text comes from the body, so it turns light in dark mode and disappears. */
    background-color: #fff;
}
```

</InvalidExample>

<ValidExample title="Do: let the surface move with the text">

```css
.my-plugin-panel {
    background-color: var(--bs-white);
}
```

</ValidExample>

### Where a colour carries meaning, fix both halves

Some colours have to stay: a status tint, a diff highlight, a question type's drag and drop shading. Do not force those onto a neutral custom property just to make them follow the mode, because you lose the meaning. Correct the other half of the pair instead, and darken the tint for dark mode so that body text still reads on it.

<ValidExample title="Do: keep the hue, move the lightness">

```css
.my-plugin-status-warning {
    background-color: #fcefdc;
    border: 1px solid #f0ad4e;
}

[data-bs-theme="dark"] .my-plugin-status-warning {
    /* Same hue, shaded rather than tinted, so that the body colour still reads on it. */
    background-color: #302310;
    border-color: #90682f;
}
```

</ValidExample>

A colour drawn on a background which does not itself change is fine as it is. A white label on a saturated brand fill reads the same in both modes, because neither of the two moved. Leave those alone, and leave a comment saying why.

### Scope genuinely mode-specific rules to the attribute

Sometimes it is behaviour rather than a colour which has to change. Scope that the same way. A common case is a pair of images, one drawn for a light background and one for a dark one, where the mode decides which of the two is shown:

```css
.my-plugin-logo-light {
    display: inline-block;
}

.my-plugin-logo-dark {
    display: none;
}

[data-bs-theme="dark"] .my-plugin-logo-light {
    display: none;
}

[data-bs-theme="dark"] .my-plugin-logo-dark {
    display: inline-block;
}
```

`aiplacement_courseassist` does this in core, for a button whose icon has to swap because the button starts light in light mode and dark in dark mode.

Because `data-bs-theme` is on the `html` tag, the attribute selector goes at the front of your existing selector. It adds one attribute's worth of specificity, so an override written this way beats the rule it corrects without you having to repeat any ancestors or reach for `!important`.

## Icons and images

An SVG which reaches the page inside an `img` tag is a separate document. Neither `currentColor` nor any rule in the page stylesheet can reach into it, so it paints with the fill baked into the file. A monochrome icon drawn in black therefore stays black on a dark page.

- Render icons through Moodle's icon system, with `$OUTPUT->pix_icon()` or the `pix` Mustache helper, wherever you can. Those are mapped to a Font Awesome icon where one exists, and so inherit `currentColor`.
- Boost lightens the icons in Moodle's monochrome `pix` namespaces (`/t/`, `/e/`, `/a/` and the group mode icons) with a CSS filter as a stopgap. Do not copy that pattern for icons of your own, as inverting a coloured icon changes its hue.
- Check any image with a background baked into it, such as a screenshot or a logo on a white plate. Those need either a transparent background or a second file.

### Editor content

<Since version="5.3" issueNumber="MDL-68037" />

The TinyMCE editor follows the colour mode of the page it is on, and the mode attribute is repeated on the root of the content iframe, so a stylesheet loaded through `content_css` can respond to it in the usual way. Style the editor content and your own editor dialogs the same way you style everything else, rather than assuming a light editor.

The skin is chosen when the editor is set up, so an editor which is already open keeps the skin it started with until the page is loaded again.

## Contrast

The dark palette is derived rather than hand-picked, so that it keeps meeting [WCAG 2.2 AA](https://www.w3.org/WAI/WCAG22/quickref/) even when a site changes its brand colour. Boost tints a theme colour until it clears 4.6:1 against the surface it is drawn on, slightly above the 4.5:1 the guideline asks for, so that a colour landing exactly on the threshold is not reported as a failure by a checker which rounds differently.

Hold your own colours to the same standards:

- Text and images of text need 4.5:1 against their background, or 3:1 at large sizes ([1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)).
- Interface components, focus indicators and meaningful graphics need 3:1 ([1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)).
- Anything which distinguishes an element must not be colour alone ([1.4.1 Use of Color](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html)). This is why Boost underlines links inside prose in dark mode: a link needs 3:1 against the body text and 4.5:1 against the surface behind it, and on a dark page those two ranges do not overlap.

Drop shadows do very little on a dark surface. If you use one to lift an element off the page, give it a border in dark mode as well.

## Testing

### Behat

The Behat CLI tools take a `--colourmode` option, so a whole run can be exercised in one mode without every feature having to set a user preference:

```bash
php admin/tool/behat/cli/init.php --colourmode=dark
```

The mode is recorded in the run configuration rather than in the database, so it survives the reset between scenarios, and it is reported in the run header. It also turns colour modes on for the run, since they are off until a site opts in. `behat_get_colour_mode()` exposes the value to themes.

Precedence is the user preference, then the run option, then the site settings. A scenario which asserts something about a particular colour mode must therefore pin the mode with a user preference rather than relying on the site default:

```gherkin
Given the following "user preferences" exist:
  | user     | preference             | value |
  | student1 | theme_boost_colourmode | dark  |
```

A scenario about the colour mode settings themselves cannot assert anything while the run is forcing a mode, so it should skip itself:

```gherkin
Given the run is not using a colour mode
```

### Accessibility tests

Contrast is the failure mode which dark mode introduces, and it is exactly what the automated accessibility checks catch. So the single most valuable thing you can do for your plugin here is to **cover its pages with `@accessibility` scenarios**, following [Accessibility testing](/general/development/policies/accessibility/testing#accessibility-tests-using-behat).

```gherkin
@javascript @accessibility
Scenario: My plugin page meets accessibility standards
  Given I am on the "My activity" "myplugin activity" page logged in as student1
  Then the page should meet accessibility standards with "best-practice" extra tests
```

Write these scenarios mode-agnostic. Because `--colourmode` applies to a whole run, the same scenario is what gets exercised in both modes: your usual run checks light mode, and a run started with `--colourmode=dark` checks the identical assertions against the dark palette. A contrast regression in dark mode then shows up as a failure of a test you already had, without you having to maintain a second copy of it.

:::tip[Run your accessibility tests in dark mode]

The point of a mode-agnostic scenario is that something runs it in dark mode. Add a dark mode job alongside your existing one in CI, and run the same locally before you release:

```bash
php admin/tool/behat/cli/init.php --colourmode=dark
php admin/tool/behat/cli/run.php --tags="@accessibility&&@mod_myplugin"
```

:::

Pinning a mode inside a scenario is worth doing only where the scenario is *about* the colour modes, rather than about a page which happens to be rendered in one. Core does this in `public/theme/boost/tests/behat/colour_mode_accessibility.feature`, which runs each page as a scenario outline over both modes, so that the light example acts as a baseline: a failure which appears only in the dark example is a colour mode regression, rather than a pre-existing problem with the page. That is the right shape for testing the colour modes themselves, and the wrong shape for a plugin, where it just doubles the length of every run.

## Themes based on Boost

A theme which inherits Boost's stylesheets inherits the colour modes with them, but there are some things to be aware of.

**Boost's palette is now read through custom properties.** Boost's own partials refer to the greyscale and the body colours as `var(--#{$prefix}gray-*)`, `var(--#{$prefix}white)`, `var(--#{$prefix}black)`, `var(--#{$prefix}body-bg)` and `var(--#{$prefix}body-color)` rather than the matching SCSS variables. A SCSS variable is resolved when the stylesheet is compiled, and there is only one compiled stylesheet, so a value which came from a variable cannot follow a mode which is decided per request. The light mode values are unchanged.

**Some preset variables now default to custom properties.** `$card-bg`, `$card-border-color`, and the `$state-*-bg` and `$state-*-border` variables default to `var(--#{$prefix}...)` rather than to a literal colour. A preset which overrides them should set a colour that the dark mode can re-point, or override the custom property directly.

**The dark palette lives in one file.** `public/theme/boost/scss/moodle/dark.scss` holds the dark values, emitted through Bootstrap's `color-mode` mixin, and it must stay the last import so that it can override everything above it. Most of the work is done by re-pointing the greyscale and the design system tokens, which flips nearly every surface, border and piece of secondary text at once.

**Per-component corrections sit next to the rule they correct.** `public/theme/boost/scss/moodle/colour-mode.scss` provides a `dark-mode` mixin for this, which prefixes the enclosing selector rather than nesting inside it:

```scss
.my-panel {
    background-color: $gray-100;

    @include dark-mode {
        background-color: var(--#{$prefix}gray-200);
    }
}
```

It also provides `dark-readable($color, $background, $min)`, which tints a colour in 5% steps until it reaches the required contrast against a dark surface. Derive a dark value with it rather than picking one by hand, so that the result stays compliant if the site changes its brand colour.

**A custom navbar needs the switcher.** A child theme which renders its own navbar should output `theme_boost\colour_mode::render_menu($output)` in it, otherwise its users have no way to choose a mode.

**The cookie.** The mode is mirrored into a `theme_boost_colourmode` cookie, holding one of `light`, `dark` or `auto`. It is written by the browser using the site's own cookie path, domain and secure settings, and is only read where there is no user preference to read. No cookie is set until a site turns colour modes on. Sites which document the cookies they set should add it to their list.

## Work still to do

Converting core is a gradual job, and a number of components still hardcode colours in their stylesheets. The remaining work is tracked as subtasks of [MDL-68037](https://moodle.atlassian.net/browse/MDL-68037), and the experimental setting exists in order to buy the time to do it. If you find a core page which does not render correctly in dark mode, check that list before reporting it.
