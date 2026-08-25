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

:::info[Colour modes are experimental]

Colour modes are turned off until a site opts in, and the default mode is Light while the feature is experimental. Do not assume that your users have the feature switched on, and do not assume that they never will.

:::

## How Boost renders a colour mode

Boost uses the [Bootstrap 5.3 colour modes API](https://getbootstrap.com/docs/5.3/customize/color-modes/). The mode the page is rendered in, `light` or `dark`, is written to the `data-bs-theme` attribute of the `html` tag, and every dark mode override in Bootstrap and in Boost is scoped to it.

People choose Light, Dark or System from a switcher in the navbar. The choice is stored as a user preference, and people who are not logged in get the mode they last chose in that browser, or the site default.

:::warning[Style against `data-bs-theme`, never against `prefers-color-scheme`]

The site default and the user's choice both override what the device reports. A style keyed off `@media (prefers-color-scheme: dark)` will therefore be applied on a light page whenever a user has picked light on a dark device, and skipped on a dark page whenever they have picked dark on a light one.

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
1. Set **Default colour mode** to `Dark`, so that every page you look at is in dark mode. Nothing puts you in dark mode just because your device asks for it. Pages you see while logged out use the mode you last chose from the switcher in that browser, so pick Dark there before you log out.

A switcher then appears in the navbar for logged in users, offering Light, Dark and System.

## Where colours come from

In order of preference:

1. **Do not set a colour at all.** [Moodle Design System](/general/designsystem/overview) components, and Bootstrap components and utility classes, already follow the mode. This is also what the [plugin contribution checklist](/general/community/plugincontribution/checklist#css-styles) asks for. Do not override a design system component's colours: an override is a colour which stops following the mode, so report a component which looks wrong rather than patching it locally.
1. **Use a utility class.** `bg-body`, `bg-body-secondary`, `bg-body-tertiary`, `text-body`, `text-body-secondary`, `text-body-emphasis`, `text-bg-*` and `border` all follow the mode. Avoid `bg-white`, `bg-light`, `text-dark` and `text-white`, which name a colour rather than a role. In particular, `text-dark` stays near black on a dark surface, so use `text-body` instead.
1. **Use a design system token.** Where you need CSS of your own, use one of the `--mds-*` tokens below.
1. **Write a literal, and correct it for dark mode.** Only where the colour carries meaning, as described in [Rules of thumb](#rules-of-thumb).

### Tokens which follow the mode

The design system tokens are emitted as custom properties on `:root`, so any plugin stylesheet can use them. Each is named for the role the colour plays, which is what keeps it correct in both modes. The values shown are those of the default Boost preset.

| Token | Light | Dark | Use it for |
| --- | --- | --- | --- |
| `--bs-body-bg` | `#f8f9fa` | `#1d2125` | The page itself |
| `--mds-bg-surface-default` | `#ffffff` | `#343a40` | A raised surface: a card, a modal, a table cell |
| `--mds-bg-surface-strong` | `#e9ecef` | `#292e33` | A recessed area of the page |
| `--mds-bg-surface-subtle` | `#f8f9fa` | `#292e33` | A subtler recessed area, a striped row |
| `--mds-text-default` | `#1d2125` | `#dee2e6` | Body text |
| `--mds-text-subtle` | `#495057` | `#ced4da` | Secondary text |
| `--mds-text-muted` | `#6a737b` | `#ced4da` | Muted text |
| `--mds-text-emphasis` | `#000000` | `#f8f9fa` | Text which needs more contrast than the body |
| `--mds-text-link-primary-default` | `#0f6cbf` | `#7baedc` | Links |
| `--mds-border-default` | `#dee2e6` | `#495057` | Borders and rules |
| `--mds-bg-feedback-*-light`, `--mds-bg-feedback-*-subtle` | A pale tint | A shaded tint | Status backgrounds for `success`, `info`, `warning` and `danger` |
| `--mds-text-feedback-*` | Readable on light | Readable on dark | Status text |

`--bs-body-bg` is the only Bootstrap property in the table, because no token means "the page". It is not white, so use `--mds-bg-surface-default` for anything raised above the page.

When replacing a literal, pick the token whose light value matches, so that light mode does not change:

| Literal | Token |
| --- | --- |
| `#fff`, `white` | `--mds-bg-surface-default` |
| `#eee` | `--mds-bg-surface-strong` |
| `#f5f5f5`, `#f8f9fa` | `--mds-bg-surface-subtle` |
| `#ddd` as a border | `--mds-border-default` |
| `#555` | `--mds-text-subtle` |
| `#666` | `--mds-text-muted` |
| `#0f6cbf` | `--mds-text-link-primary-default` |

:::warning[Check both values before swapping]

The `--mds-*` and `--bs-*` families are not parallel, so do not match on the name alone. For example, `--mds-border-translucent` is fully transparent in light mode, and would erase a border which `--bs-border-color-translucent` draws.

Some tokens deliberately keep their colour in both modes. The saturated fills, such as `--mds-bg-feedback-*-default` and `--mds-bg-interactive-primary-*`, carry their own text colour, chosen against the fill rather than the page. If you draw your own text on one of them, choose it against the fill too.

:::

## Auditing your plugin

Start by finding every colour your plugin names for itself:

```bash
grep -rniE '#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|(^|[^-])\b(white|black|silver|gr[ae]y|whitesmoke)\b([^-]|$)|\b(bg|text)-(white|black|light|dark)\b' styles.css templates amd/src
```

Not every hit needs changing: a fallback inside `var()`, such as `var(--bs-emphasis-color, #000)`, and a colour named in a comment are fine.

Then check for colours which are set from PHP, such as a `style` attribute, or colours passed into a chart, a canvas, or an inline SVG. Check images and icons too, as described in [Icons and images](#icons-and-images).

Finally, look at each page of your plugin in both modes, and read the result rather than trusting the diff. A rule can be correct in isolation and still fail because of the rule next to it.

A stylelint rule which reports literal colours in plugin stylesheets is planned in [MDL-89377](https://moodle.atlassian.net/browse/MDL-89377).

## Rules of thumb

### A literal colour is a problem when it is only half of a pair

A colour goes wrong when it is fixed and the thing next to it moves: a fixed light background behind text which follows the mode, or fixed dark text on a surface which follows the mode.

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
    background-color: var(--mds-bg-surface-default);
}
```

</ValidExample>

### Where a colour carries meaning, fix both halves

Some colours have to stay: a status tint, a diff highlight, a drag and drop question's shading. Do not swap those for a neutral token, because you lose the meaning. Keep the hue, and shade it for dark mode so that body text still reads on it.

<ValidExample title="Do: keep the hue, move the lightness">

```css
.my-plugin-status-warning {
    background-color: #fcefdc;
    border: 1px solid #f0ad4e;
}

[data-bs-theme="dark"] .my-plugin-status-warning {
    background-color: #302310;
    border-color: #90682f;
}
```

</ValidExample>

A colour drawn on a background which does not change is fine as it is. A white label on a saturated brand fill reads the same in both modes, because neither of the two moves. Leave those alone, with a comment saying why.

### Scope mode-specific rules to the attribute

Sometimes it is behaviour rather than a colour which has to change, such as showing one of two images depending on the mode:

```css
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

Because `data-bs-theme` is on the `html` tag, the attribute selector goes at the front of your existing selector. It adds one attribute's worth of specificity, so the override beats the rule it corrects without repeating any ancestors or using `!important`.

## Icons and images

An SVG which reaches the page inside an `img` tag is a separate document. Neither `currentColor` nor the page stylesheet can reach into it, so a monochrome icon drawn in black stays black on a dark page.

- Render icons with `$OUTPUT->pix_icon()` or the `pix` Mustache helper wherever you can. Those map to a Font Awesome icon where one exists, and so inherit `currentColor`.
- Do not invert your own icons with a CSS filter, as inverting a coloured icon changes its hue.
- Check any image with a background baked into it, such as a screenshot or a logo on a white plate. Those need either a transparent background or a second file.

## Editor content

TinyMCE follows the colour mode of the page, and repeats the `data-bs-theme` attribute on the root of the content iframe. The skin is chosen when the editor is set up, so an open editor keeps its skin until the page is reloaded.

The content iframe is styled with Bootstrap's stock palette rather than Moodle's, so the `--mds-*` tokens are not defined there, and the `--bs-*` properties hold Bootstrap's own values ([MDL-89378](https://moodle.atlassian.net/browse/MDL-89378)). Until that is fixed, a rule for the editor content itself needs a literal, with a dark correction scoped to `[data-bs-theme="dark"]` and a comment saying why. Dialogues, modals and drawers which an editor plugin adds sit on the main page, so they can use the tokens as normal.

## Contrast

Boost derives its dark palette so that it keeps meeting [WCAG 2.2 AA](https://www.w3.org/WAI/WCAG22/quickref/) even when a site changes its brand colour. Hold your own colours to the same standard:

- Text needs 4.5:1 against its background, or 3:1 at large sizes ([1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)).
- Interface components, focus indicators and meaningful graphics need 3:1 ([1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)).
- Colour must not be the only thing which distinguishes an element ([1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)). This is why Boost underlines links inside prose in dark mode.

Drop shadows do very little on a dark surface. If you use one to lift an element off the page, give it a border in dark mode as well.

## Testing

### Behat

`init.php` and `util.php --enable` take a `--colourmode` option, which sets the mode for every test run after them and turns colour modes on for those runs:

```bash
php admin/tool/behat/cli/init.php --colourmode=dark
```

A user preference still takes precedence over the run option. A scenario which asserts something about a particular mode should therefore pin it with a user preference:

```gherkin
Given the following "user preferences" exist:
  | user     | preference             | value |
  | student1 | theme_boost_colourmode | dark  |
```

A scenario about the colour mode settings themselves cannot work while the run forces a mode, so it should skip itself with:

```gherkin
Given the run is not using a colour mode
```

### Accessibility tests

Contrast is what dark mode breaks, and it is what the automated accessibility checks catch. The most valuable thing you can do here is to **cover your plugin's pages with `@accessibility` scenarios**, following [Accessibility testing](/general/development/policies/accessibility/testing#accessibility-tests-using-behat).

```gherkin
@javascript @accessibility
Scenario: My plugin page meets accessibility standards
  Given I am on the "My activity" "myplugin activity" page logged in as student1
  Then the page should meet accessibility standards with "best-practice" extra tests
```

Do not pin a colour mode in these scenarios. A run without `--colourmode` checks light mode, because colour modes are off on a freshly installed Behat site whatever your development site is set to, and a run on a site initialised with `--colourmode=dark` checks the same assertions in dark mode, so add that run to your CI and run it locally before you release:

```bash
php admin/tool/behat/cli/init.php --colourmode=dark
php admin/tool/behat/cli/run.php --tags="@accessibility&&@mod_myplugin"
```

The checks do not enter iframes, and do not check non-text contrast, so borders, focus rings, icons and editor content still need checking by eye.

## Themes based on Boost

A theme which inherits Boost's stylesheets inherits the colour modes with them, but there are some things to be aware of.

**The colour mode API.** `theme_boost\colour_mode` is the entry point for reading or rendering the mode:

| Method | Returns |
| --- | --- |
| `colour_mode::is_enabled()` | Whether colour modes are turned on for this site |
| `colour_mode::get_current_mode()` | The mode for the current page: `light`, `dark` or `auto` |
| `colour_mode::get_site_default()` | The mode used by people who have not chosen one |
| `colour_mode::can_choose_mode()` | Whether the current user can pick their own mode |
| `colour_mode::render_menu($output)` | HTML for the navbar switcher, or an empty string |

The chosen mode, which may be `auto`, is also written to the `data-colourmode` attribute of the `html` tag. Where it is `auto`, a script in the page head resolves it against `prefers-color-scheme` before the page is painted, and follows the device if it changes.

**A custom navbar needs the switcher.** A child theme which renders its own navbar should output `theme_boost\colour_mode::render_menu($output)` in it, otherwise its users have no way to choose a mode.

**Boost's palette is now read through custom properties.** Boost's own partials refer to the greyscale and the body colours as `var(--#{$prefix}gray-*)`, `var(--#{$prefix}white)`, `var(--#{$prefix}black)`, `var(--#{$prefix}body-bg)` and `var(--#{$prefix}body-color)` rather than the matching SCSS variables. A SCSS variable is resolved when the stylesheet is compiled, so it cannot follow a mode which is decided per request. The light mode values are unchanged.

**Some preset variables now default to custom properties.** `$card-bg`, `$card-border-color`, and the `$state-*-bg` and `$state-*-border` variables default to `var(--#{$prefix}...)` rather than to a literal colour. A preset which overrides them should set a colour that the dark mode can re-point, or override the custom property directly.

**The dark palette lives in one file.** `public/theme/boost/scss/moodle/dark.scss` holds the dark values, emitted through Bootstrap's `color-mode` mixin, and it must stay the last import so that it can override everything above it.

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

**The cookie.** The mode is mirrored into a `theme_boost_colourmode` cookie, holding one of `light`, `dark` or `auto`, so that pages seen while logged out keep the mode last chosen in that browser. It uses the site's cookie path, domain and secure settings, and is not set until a site turns colour modes on. Sites which document the cookies they set should add it to their list.

## Work still to do

A number of core components still hardcode colours in their stylesheets. The remaining work is tracked under the [MDL-89733](https://moodle.atlassian.net/browse/MDL-89733) epic, so check it before reporting a core page which does not render correctly in dark mode.

[MDL-89379](https://moodle.atlassian.net/browse/MDL-89379) will move the two settings off the Experimental tab, turn colour modes on by default, and make `System` the default mode.
