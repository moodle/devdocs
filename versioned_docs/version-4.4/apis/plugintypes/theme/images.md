---
title: Images and icons in themes
tags:
  - Plugins
  - Theme
  - Images
  - Icons
sidebar_position: 2
sidebar_label: Images and icons
---

One of the theme features is the ability to override any of the standard images within Moodle when your theme is in use. At this point, let's explore how to utilize your own images within your theme and how to override the images being used by Moodle.
So first up a bit about images within Moodle:

1. Images you want to use within your theme **must** to be located within your theme's `pix` directory.
1. You can use sub directories within the `pix` directory of your theme.
1. Images used by Moodle's core are located within the `pix` directory of Moodle.
1. All plugins should store their images within their own `pix` directory.

The following section assumes that there are two image files in the `pix` directory of a theme named `yourthemename`:

- `/theme/yourthemename/pix/imageone.svg`
- `/theme/yourthemename/pix/subdir/imagetwo.png`

The first image is an SVG, and the second a PNG located in a subdirectory.

## Use images in templates

The following example illustrates how to make use of these images within your layout file so they can be inserted in your layout template.

```php title="theme/yourtheme/layout/somelayout.php"
$templatecontext = [
    $imageone => $OUTPUT->pix_url('imageone', 'theme'),
    $imagetwo => $OUTPUT->pix_url('subdir/imagetwo', 'theme'),
];

echo $OUTPUT->render_from_template('theme_yourtheme/somelayout', $templatecontext);
```

:::note

A method of Moodle's output library is utilized to generate the URL to the image. It's not too important how that function works, but it is important that it's used, as it's what allows images within Moodle to be overridden.

:::

:::danger Important

**DO NOT** include the image file extension. Moodle will work it out automatically and it will not work if you do include it.

:::

```handlebars title="theme/yourtheme/templates/somelayout.mustache"
<img src="{{{imageone}}}" alt="Please give your image alt text or set the role to presentation" width="50" height="50">
<img src="{{{imagetwo}}}" alt="Please give your image alt text or set the role to presentation" width="50" height="50">
```

## Use images in CSS

The following is how you would use the images from within CSS/SCSS as background images.

```css
.divone {
    background-image: url([[pix:theme|imageone]]);
}

.divtwo {
    background-image: url([[pix:theme|subdir/imagetwo]]);
}
```

A placeholder is used within the CSS  to allow use of a pix icon. During the CSS/SCSS compilation, these placeholders are converted into a URL which the browser can fetch and serve.

:::note

Notice that the image file extension included. The reason for this leads us into the next topic, how to override images.

:::

## Override images

From within a theme you can **very** easily override any standard image within Moodle by simply adding the replacement image to the theme's pix directory in the same sub directory structure as it is in Moodle.
So, for instance, if there is a need to override the following images:

1. `/pix/moodlelogo.png`
1. `/pix/i/user.svg`
1. `/mod/chat/pix/monologo.svg`

Simply add the replacement images to the theme in the following locations:

1. `/theme/themename/pix_core/moodlelogo.png`
1. `/theme/themename/pix_core/i/user.svg`
1. `/theme/themename/pix_plugins/mod/chat/monologo.svg`

:::note

A `pix_core` directory has been created in the theme to store the replacement images. For a specific activity module like chat, the directory `pix_plugins/mod/chat` is needed. This directory is `pix_plugins` and then the plugin type (`mod`) and then the plugin name (`chat`).

:::

Another noteworthy aspect is that Moodle not only searches for replacements of the same image type (svg, png, jpg, gif, and so on) but also replacements in any image format. This is why the image file extension was never specified when working with our images above.
This means that the following would also work:

1. `/theme/themename/pix_core/moodlelogo.svg`
1. `/theme/themename/pix_core/i/user.jpg`

For a more detailed description of how this all works see the page on [Using images in a theme](https://docs.moodle.org/dev/Using_images_in_a_theme).
