# Validation summary

- 10/10 charts loaded at 1440px, 768px and 390px viewport widths.
- No page-level or chart-container horizontal overflow at those widths.
- No Vega-Lite compile warnings, browser console warnings/errors, or page exceptions in the final automated run.
- State selection updates all five linked views and the 14-row exact-value table. Reset restores all rows.
- Map click, percentage/hectare axis units, district focus, rainfall-state selection, keyboard skip link, CSV export and live resizing passed.
- Original 10 data files and sketch are unchanged. National and state totals, endpoint differences, per-capita comparisons and flood percentages were checked by the preparation script.
- Final desktop, mobile, composition, state-map and rainfall screenshots were inspected. The missing-year gap is blank in both temporal views; labels and axes were revised after visual review.

Run `python scripts/prepare_and_validate.py` from the project root for numerical checks. For browser checks, start the local server at port 8765, install Playwright and use an installed Edge browser, then run `node scripts/browser_check.cjs`. Set SHOW_BROWSER=1 for a visible test window. The browser test requires Playwright to be resolvable by Node (locally or through NODE_PATH).

These checks cover the tested rendering and interactions. They are not a new grading assessment, a complete accessibility audit, or independent authentication of every source observation. See methodology.md for provenance limits.
