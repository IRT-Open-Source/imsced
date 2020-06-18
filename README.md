# imscED

imscED is an editor for the subtitles and caption format
[IMSC](https://www.w3.org/TR/ttml-imsc1/). It shows how
[imscJS](https://github.com/sandflow/imscJS) from Pierre Lemieux can be used
to manipulate style attributes from an parsed IMSC document and how to export
it back to XML.

Note that this project is a pre-alpha release for developer review. It is
a prototype in development and can change at any time. The code does not
represent a public API.

Therefore it is not ready for production and use it at your own risk.

## Demo

You can trial the latest build at:

http://subtitling.irt.de/imsced/

## Restrictions

See below for some of the important restrictions.

### Adding and removing content elements

- It is not possible to add content elements (`div`, `p`, `span` etc.).

### Timing values

- Timing values are only displayed for `p` elements.
- Timing values cannot be changed.

### Parameter

- TTML parameter (`ttp:timeBase`, `ttp:frameRate` etc.) cannot be changed.
- Not all TTML parameter are exported.

### Interactive positioning and resizing

- Dynamic positioning ("dragging") and resizing of regions work only if `tts:origin` and `tts:extent` are specified for a `<region>`.
- If `tts:position` is used instead of `tts:origin` dynamic positioning and resizing will not work.

### File export

- The exported document structure is different from the original document structure. It is normalized based on the parsing by imscJS.
- TTML metadata, foreign namespace elements and foreign namespace attributes are not exported.
- Not all TTML parameters are exported.

### Style attribute support

See below for the current style attribute support:

| Style Attribute |
| --------------- |
| backgroundColor |
| color           |
| direction       |
| display         |
| displayAlign    |
| extent          |
| forcedDisplay   |
| fillLineGap     |
| fontFamily      |
| fontSize        |
| fontStyle       |
| fontWeight      |
| lineHeight      |
| multiRowAlign   |
| opacity         |
| origin          |
| ruby            |
| rubyAlign       |
| rubyPosition    |
| shear           |
| showBackground  |
| textAlign       |
| textShadow      |
| unicodeBidi     |
| visibility      |
| wrapOption      |
| writingMode     |

### Player Controls

- Native player controls for closed captions and fullscreen do not work with timed text rendering.
- To view the video in full-screen mode, use the "Fullscreen" icon below the video.

### Integrated REST services

#### SCF Service

The Subtitling Conversion Framework [(SCF)](https://github.com/IRT-Open-Source/scf) is used as a REST service to import SRT and EBU STL files. At the moment a public URL for this REST service is configured. See the [Service README](https://github.com/IRT-Open-Source/scf/blob/master/README-SCF-SERVICE.md) of the SCF project how to setup your own SCF service.

#### Burnin-Service

The Video Image Burner [(VIB)](https://github.com/IRT-Open-Source/vib/blob/master/README.md) is used as a REST service to "burn in" IMSC subtitles. This option is deactivated by default. You need to setup your own VIB service, before activating this option in the configuration menu of the editor. See the [README](https://github.com/IRT-Open-Source/vib/blob/master/README.md) of the VIB project for more information.

To be used by imscED, the service needs to available at http://localhost:9010.

### Configuration

#### Integration of Custom Settings in Build Process

A custom settings file can be added to the build process. This file is separated
from the imscED repository. It is stored in a "custom" folder. This folder is ignored by this git
repository. This way custom settings and other files can be maintained by the user in a seperate,
user-specific repository.

To enable this customization feature the file `.env.local` needs to be added to the root directory.

```bash
touch .env.local
```

The content
of the file needs to be as follows:

```
VUE_APP_CUSTOMSETTINGS  = true
```

> Note: It is possible to use the `.env` file in the root directory as blueprint and to rename it into `.env.local`

Then a custom folder needs to be added to the root directory with a file named `customSettings.json`.

```bash
mkdir custom
touch custom/customSettings.json
```

The custom settings file need to have the following structure:

```json
{
  "charsPerLine": 37,
  "lang": "de",
  "maxLinesPerST": 2,
  "minStDuration": 1,
  "readingSpeed": 14,
  "showHints": "show",
  "showVisualization": "show"
}
```

Values can be adapted to the user requirements.

Currently, only the following settings can be changed:

- language of the user interface (German and English are supported)
- maximum numbers of characters per line
- maximum number of lines per subtitle block
- minimum duration of the subtitle block
- assumed average reading speed
- switch to control the display of error messages and hints
- switch to control the display of the duration guideline compliance visualization

To get the settings into effect the project need to be rebuild (i.e. the development server needs to be restarted).

## Contributions

If you want to ...

- submit a feature request,
- file a bug,
- discuss implementation strategies

... then we are looking forward to your comments on the project's issue tracker.

Note that imscEd is in pre-alpha status and not stable. Therefore we do not expect
any pull requests or code contribution yet.

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run serve

# build for production with minification
npm run build

# You need to copy the content of the dist directory
# to your production environment

```

## Authors

Maintainer: Andreas Tai (IRT)

Development: Michaela Finger (IRT), Yury Lungantsov (IRT), Andreas Tai (IRT)

UI Concept: Laura Ehlis (IRT), Michaela Finger (IRT)

## Acknowledgement

Parts of imscED were developed in the project dwerft - linked metadata for media ([www.dwerft.de](https://www.dwerft.de/)).

dwerft - linked metadata for media is a research and development project for innovative media tech solutions by different media and IT companies located at the renowned area of Babelsberg.

The project is funded by Bundesministerium für Bildung und Forschung and Innovative regionale Wachstumskerne PLUS.
