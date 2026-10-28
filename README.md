# Malaysia's Forest Reserves - A Changing Landscape

A visual story about Malaysia's recorded forest reserve areas, state differences, population, and flood-record context. Built with HTML, CSS, JavaScript, Vega-Lite and Vega-Embed.

## What you can explore

- **10 charts in 4 chapters**: national trends, state differences, population comparisons, and flood context.
- Highlight a state across five charts, switch percentage/hectare units, and filter district or rainfall views.
- Open an exact-value table and download selected rows as CSV.
- Read missing-data notes, source definitions and limitations alongside the charts.

## Run locally

Open this folder in VS Code and use Live Server, or run:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`. Use an HTTP server, rather than double-clicking the HTML file. Visualisation libraries are bundled locally; chart rendering does not require a CDN or external map request.

## Files

```text
index.html               Page and story
css/style.css            Responsive layout and styling
js/main.js               Chart loading, state focus, table and downloads
vega/                    10 numbered chart specifications
data/                    Original supplied inputs; unchanged
data/derived/            Rebuilt display data
scripts/                 Data preparation and validation
docs/                    Design notes, feedback response and test evidence
vendor/                  Pinned chart libraries and licences
sketch.pdf               Original design sketch, retained unchanged
```

## Check the calculations

```bash
python scripts/prepare_and_validate.py
```

This rebuilds three derived files and checks totals, endpoint differences, flood percentages, file paths and original-data hashes. It does not independently authenticate the underlying source observations.

Browser checks and screenshots are recorded in `docs/`. See `docs/feedback-response.md` for the response to the original marking feedback and `docs/methodology.md` for definitions and design choices.

## Important data limits

The supplied reserve snapshot covers 2003-2021, not the latest live figures. National values for 2010-2011 are missing. From 2017 the official Peninsular series excludes proposed reserves, so the entire endpoint difference must not be called deforestation.

Flood percentages refer to available district records, not flood severity or future probability. The district map covers a selected subset. Population, land-area denominators and geography have different sources and require their own metadata checks.

Two supplied analyses are retained but excluded from the page: the external national forest-cover comparison and the Pahang tree-cover overlay. Their definitions or processing cannot be reproduced from the supplied files.

## Sources and credit

The portfolio revision addresses chart design, layout, story and data-expression issues

Reserve data: [national](https://data.gov.my/data-catalogue/forest_reserve) and [state](https://data.gov.my/data-catalogue/forest_reserve_state) series, Forestry Department / DOSM, CC BY 4.0. Other original source links and limitations are listed on the page and in `docs/methodology.md`. Confirm third-party data and map licences before public redistribution.
