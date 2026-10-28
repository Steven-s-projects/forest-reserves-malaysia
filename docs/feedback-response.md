# Response to marking feedback

The original rubric was read visually to locate the ticks, not inferred from extracted text. The following are original grades, not reassessed grades.

| Criterion | Original | Changes made | Evidence to inspect |
| --- | --- | --- | --- |
| Sketch quality | HD | Original sketch retained without alteration | sketch.pdf |
| Number and quality of idioms | C | Retained 10 complementary views; corrected exact positions, missing years and proportions; meaningful state/unit/subset interactions; replaced unverifiable comparisons | vega/, methodology.md, browser validation |
| Layout, balance and white space | D | Shared grid and spacing scale, four chapter groups, concise chart headers, controlled paired views and single-column mobile layout | desktop and mobile screenshots |
| Sight-line alignment | D | Consistent chart boundaries; annotations and definitions sit with the relevant figure; navigation anchors reduce long-page searching | screenshots, index.html |
| Colour and figure-ground hierarchy | D | Stable semantic palette; neutral backgrounds; lighter context marks; explicit no-data colour; map district colours reduced from 26 to one frequency encoding | charts 4, 7, 8, 9 |
| Typography | HD | Preserved readable serif/sans hierarchy; consistent chart labels and mobile type sizes | style.css and screenshots |
| Storytelling | D | Overview to geography to people to flood context; question-driven transitions, source caveats, measured conclusion | four chapter headings and takeaway |
| Annotations and text | C | Data-backed extrema, endpoint contribution, denominator notes, 2017 marker, true missing-data gap and exact-value table | charts 1-10 and data validation |
| Grammar | HD | Replaced ambiguous flood/forest wording with precise English | index.html |
| Writing | HD | Short paragraphs and explanatory subtitles; avoids causal and normative claims | index.html |
| Metadata | HD | Retained links and added source caveats, coverage, known provenance gaps, local runtime versions and computation notes | page sources, methodology.md, vendor/ |
| Domain, who, what, why, how | D | Explicit audience/tasks; rationale for idioms, encoding, perceptual hierarchy, interaction, grouping and accessibility | methodology.md and page design notes |

## Specific errors corrected beyond the feedback

- Coverage-map subtitle described a different denominator from the actual calculation.
- Close share values were shifted to make marks separate; exact values are now used.
- Missing reserve data was converted into zero; the new map uses grey and an availability tooltip.
- Missing years were compressed by an ordinal axis or bridged by shapes; the new views have quantitative time and separate segments.
- Blank percentage changes for Labuan and Putrajaya were treated as increases; these records are excluded from observed-endpoint comparisons.
- The old flood interpretation confused reporting frequency with heavy/severe flooding.
- An unsupported national forest-cover comparison and unreproducible tree-cover overlay were removed from the active story, without deleting supplied source files.
- A headline calculated during revision was corrected to 60.9% after independent data checks.

## Acceptance boundary

All identified C/D criteria have implementation changes and reviewable evidence. No new grade has been awarded and no HD score is guaranteed. Source authenticity, missing map-licence metadata and absent original spatial-processing code cannot be fixed by visual styling; they are explicitly disclosed or kept out of the main analysis.

Final validation: see [validation-summary.md](validation-summary.md), [data-validation.json](data-validation.json) and [browser-validation.json](browser-validation.json).
