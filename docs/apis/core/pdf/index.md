---
title: PDF API
tags:
  - PDF
  - Accessibility
  - Files
description: Generating tagged, accessible PDF documents in Moodle.
---

<Since version="5.3" issueNumber="MDL-83411" />

Moodle generates PDF documents using [tc-lib-pdf](https://github.com/tecnickcom/tc-lib-pdf), wrapped by
the `\core\pdf\document` class. This is the preferred way to create a PDF from Moodle code.

The older `\pdf` class in `lib/pdflib.php`, which wraps
[TCPDF](https://github.com/tecnickcom/TCPDF), is still present and still supported, but it is
discouraged for new code. TCPDF cannot produce _tagged_ output, which means the documents it
generates carry no structural information and cannot be navigated by a screen reader.

:::info[Why the change]

A PDF is only accessible if it is _tagged_: the file has to carry a structure tree describing which
runs of text are headings, which are paragraphs, which cells belong to which table header, and what
an image depicts. TCPDF has never emitted one. tc-lib-pdf gained PDF/UA support in April 2026, which
made this migration possible.

:::

## Creating a document {/* #creating-a-document */}

```php title="A minimal document"
$doc = new \core\pdf\document();

// PDF/UA requires a document title, so always set a meaningful one.
$doc->setTitle(get_string('coursereport', 'mod_example'));

$doc->addPage();
$region = $doc->page->getRegion();

$doc->addHTMLCell(
    html: '<h1>Course report</h1><p>Hello world.</p>',
    posx: 20,
    posy: 20,
    width: $region['RW'] - 40,
    height: 0,
);

$contents = $doc->getOutPDFString();
```

The document can then be sent to the browser, or stored:

```php title="Sending the document"
$doc->setPDFFilename('coursereport.pdf');
send_file($doc->getOutPDFString(), 'coursereport.pdf', 0, 0, true, true, 'application/pdf');
```

### What `\core\pdf\document` adds {/* #what-document-adds */}

`\core\pdf\document` extends the library's own `Com\Tecnick\Pdf\Tcpdf` class, so the full upstream
API is available. On top of it, the Moodle wrapper:

- defaults the conformance profile to **PDF/UA-1**, so accessible output is what you get without
  opting in;
- sets the document language and reading direction from the current language;
- sets the creator to the Moodle release, and the author to the site full name;
- resolves the default font, honouring `$CFG->pdfexportfont`;
- points the library's temporary file cache inside `$CFG->cachedir` rather than the system temporary
  directory;
- builds the allowlist of local filesystem paths the library may read images and fonts from.

:::warning[Use `addPage()`, not `$doc->page->add()`]

Both add a page, but only `addPage()` tells the graphics layer the dimensions of the new page. Text
is positioned correctly either way, so the difference does not show up until something is drawn. At
that point, cell borders and background fills are placed against a page height of zero and land off
the page.

:::

### Conformance profiles {/* #conformance-profiles */}

The constructor takes a `Com\Tecnick\Pdf\PdfConformance` enum. It defaults to
`PdfConformance::Pdfua1`, and the PDF/A and PDF/X profiles are also available. Pass
`PdfConformance::None` only when a caller genuinely needs a feature the accessible profile forbids:

```php title="Opting out of tagged output"
$doc = new \core\pdf\document(mode: \Com\Tecnick\Pdf\PdfConformance::None);
```

## Writing accessible content {/* #writing-accessible-content */}

Headings, tables, lists, links and images with alt text passed to `addHTMLCell()` are mapped to PDF
structure elements automatically. **Preferring HTML content over manually positioned text is the
simplest way to keep a document accessible**, and the reason `dataformat_pdf` was rewritten to build
an HTML table rather than drawing each cell.

The rules are the familiar HTML accessibility rules:

- always call `setTitle()`;
- do not skip heading levels;
- mark table header cells up as `<th>` with a `scope` attribute, and put the header row inside a
  `<thead>` so the library repeats it on each new page;
- give every `<img>` an `alt` attribute.

```php title="A tagged table"
$html = \html_writer::tag('thead', \html_writer::tag('tr',
    \html_writer::tag('th', 'Name', ['scope' => 'col']) .
    \html_writer::tag('th', 'Grade', ['scope' => 'col']),
));
$html .= \html_writer::tag('tbody', $rows);

$doc->addHTMLCell(html: \html_writer::tag('table', $html), /* ... */);
```

:::note[Images must be embedded]

The library refuses local reads outside an explicit allowlist, and a Moodle file URL would be
fetched over HTTP and return the login page. Embed file content as a `data:` URI instead, as
`dataformat_pdf` does in `export_html_image_source()`.

:::

### Tagging costs memory {/* #tagging-costs-memory */}

Rendering HTML in one pass means holding the document in memory, and the structure tree is itself
substantial, at roughly 0.08MB per table row, where TCPDF's cell-by-cell approach was flat
regardless of size. Moodle only requires a 96MB memory limit, so **code that generates a document
of unbounded size should raise the limit**:

```php
raise_memory_limit(MEMORY_EXTRA);
```

The generated files are legitimately larger too: a thousand-row report export grows from around
200KB to around 770KB.

## Fonts {/* #fonts */}

The bundled font families are `core` (standard-14 metrics, not embedded), `freefont` (GNU FreeFont,
the default) and `pdfa` (embedding-safe, required for PDF/A and PDF/UA output). They live in
`lib/tecnickcom/tc-lib-pdf-font/fonts/`.

`\core\pdf\document::DEFAULT_FONT` is `freeserif`. The `freefont` family names line up exactly with
TCPDF's, so `PDF_DEFAULT_FONT` and `$CFG->pdfexportfont` carry over unchanged.

A handful of static helpers are available for working out what a site has:

| Method | Purpose |
| --- | --- |
| `document::get_available_fonts()` | Every font family available, mapped to the directory it was found in. |
| `document::font_exists($family)` | Whether a family is bundled or present in the site font directory. |
| `document::find_font_file($family)` | The definition file for a family, or `null`. |
| `document::get_font_directories()` | The directories searched for font definitions. |
| `document::get_site_font_directory()` | Where a site adds its own fonts. Honours `PDF_CUSTOM_FONT_PATH`, otherwise `$CFG->dataroot/fonts`. |
| `document::get_unconverted_fonts()` | Families the site added for TCPDF that this library cannot read. |

### Site-added fonts have to be converted again {/* #converting-fonts */}

The two libraries share the `.z` and `.ctg.z` companion files but differ in the metrics file: TCPDF
reads a `.php`, tc-lib-pdf reads a `.json`. A font added for TCPDF is therefore **invisible** to the
new library, and a document configured to use it silently falls back to the default font. For a
script FreeSerif does not cover, that means a document full of blank space.

TCPDF's `addTTFfont()` has no equivalent here. A new CLI script replaces it:

```bash
php admin/cli/convert_pdf_font.php --font=/path/to/font.ttf
```

It writes to the site font directory by default, and prints the resulting family name for
`$CFG->pdfexportfont`. `--list` shows what the site already has. Sites are also notified on the admin
notifications page when unconverted fonts are detected.

The existing TCPDF-format files should be left in place: PDF annotation and the Brickfield
accessibility report still use them.

:::note[Non-fatal, but noisy]

When `$CFG->pdfexportfont` names a font that cannot be found, `\core\pdf\document` emits a
`DEBUG_DEVELOPER` message rather than failing, and falls back to `freeserif`.

:::

## Coexistence with TCPDF {/* #coexistence-with-tcpdf */}

Both libraries are in core, and they share some ground. Two constants matter if you are working in
this area:

- **`K_PATH_CACHE`** is read _and_ defined by both libraries, so whichever loads first in a request
  wins. Both now agree on `$CFG->cachedir . '/tcpdf/'`, and neither redefines it. Left unguarded,
  TCPDF's cache could silently move out of moodledata and into the system temporary directory.
- **`K_PATH_FONTS`** deliberately still belongs to TCPDF and points at the TCPDF font set. It is
  claimed first-come, first-served, so Moodle must not define it: TCPDF would then look for its own
  fonts in the wrong place, breaking PDF annotation and Brickfield. tc-lib-pdf finds its bundled
  fonts by walking up from its own source directory, and the site font directory through the
  Moodle-specific `K_PATH_ADDITIONAL_FONTS` constant instead.

Both behaviours are covered by unit tests in `lib/tests/pdf/document_test.php`, because they are
easy to break by tidying up the font path later.

:::info[tc-lib-pdf-font is patched]

`K_PATH_ADDITIONAL_FONTS` exists because of a small Moodle patch to two files in
`tc-lib-pdf-font`, marked with `MOODLE PATCH` comments and recorded in
`lib/tecnickcom/readme_moodle.txt`. The package is flagged `<customised/>` in `thirdpartylibs.xml`.
The patch is temporary: once TCPDF is removed, `K_PATH_FONTS` is free and both hunks can go.

That same file is the starting point for anyone updating the bundled library.

:::

## Migrating from `\pdf` {/* #migrating-from-pdf */}

`class pdf extends TCPDF` is public API, so it is unchanged and plugins that extend it keep working.
It is not deprecated yet: the deprecation and the eventual removal of TCPDF are tracked separately.

When you do migrate, the important lesson from converting `dataformat_pdf` is that **swapping the
engine is not enough; the calling code has to change**. The accessibility gain came from rewriting
the writer to emit a real `<table>` with `<thead>` and scoped `<th>`. The old writer drew each cell
individually, which is precisely the untagged grid of unrelated cells the migration exists to get
away from, and it would have stayed that way under a new library. This is also why `\pdf` cannot
simply be reparented onto tc-lib-pdf.

Rough equivalents:

| TCPDF / `\pdf` | tc-lib-pdf / `\core\pdf\document` |
| --- | --- |
| `new \pdf()` | `new \core\pdf\document()` |
| `AddPage('L')` | `addPage(['format' => 'A4', 'orientation' => 'L'])` |
| `writeHTMLCell($w, $h, $x, $y, $html, ...)` | `addHTMLCell(html: $html, posx: $x, posy: $y, width: $w, height: $h)` |
| `Output($filename, 'D')` | `getOutPDFString()`, then `send_file()` |
| `Output($filepath, 'F')` | `getOutPDFString()`, then `file_put_contents()` |
| `SetFont($family, '', $size)` | `set_default_font($family, $size)` |
| `getPageWidth()`, `getMargins()` | `$doc->page->getRegion()` |
| `addTTFfont()` | `admin/cli/convert_pdf_font.php` |
| `TCPDF2DBarcode` | `Com\Tecnick\Barcode` (tc-lib-barcode, already bundled) |
| `Header()` / `Footer()` overrides | No direct equivalent. |

TCPDF also remains in place for `mod_assign`'s PDF annotation, which depends on FPDI. tc-lib-pdf has
its own import subsystem, so FPDI is not needed long term, but that conversion has not been done.

## Testing {/* #testing */}

`lib/tests/other/pdfdocumenttestpage.php` is the counterpart of the existing
`lib/tests/other/pdflibtestpage.php`, and is available to site administrators. It generates the same
document with and without the PDF/UA profile, so the two can be compared in a structure inspector.
This matters because tc-lib-pdf has no interface of its own to test against.

To confirm that output really is tagged, inspect the structure tree with a PDF/UA checker such as
[PAC](https://pdfua.foundation/en/pdf-accessibility-checker-pac/), or with the accessibility panel
of a PDF reader.
