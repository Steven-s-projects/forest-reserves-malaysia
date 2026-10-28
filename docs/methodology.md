# Methodology and design rationale

## Audience, task and scope

The audience is environmental communicators and readers comparing Malaysian reserve geography. Tasks: identify temporal change, compare jurisdictions, inspect population context, and distinguish flood-record patterns from causal claims. The dashboard is descriptive and unsuitable for site-level risk forecasting.

## Verified official caveat

The national and state data.gov.my catalogue methodology was checked on 28 October 2026. Before 2017, Peninsular values include proposed reserves; from 2017 they include gazetted reserves only. National values for 2010-2011 are unavailable; the state catalogue identifies missing Sarawak values in those years. The project keeps its original historical extract, without silently replacing it with newer observations.

Sources: https://data.gov.my/data-catalogue/forest_reserve and https://data.gov.my/data-catalogue/forest_reserve_state . The official series are CC BY 4.0. Dates stored as January 1 indicate an annual reference year, not a daily measurement.

## Chart and calculation choices

1. National trend: quantitative year axis, separate line paths around 2010-2011, grey missing-data band and a 2017 definition marker. Truncated area scale is labelled and has visible ticks; it is used for a line, not a magnitude bar.
2. Regional composition: Sarawak, Sabah and the supplied Peninsular jurisdictions. Separate area layers before and after the missing years preserve an actual blank interval. Colours differentiate composition while keeping the forest green family.
3. Endpoint contribution: sum each observed state's 2021 minus 2003 hectares. Sarawak plus the other 13 equals the national net difference. It is an accounting identity, not causal inference.
4. Choropleth: reserve area / supplied state land area x 100. Unmatched geography is grey rather than zero. Mercator fits the bundled geometry automatically; no fixed zoom hides East Malaysia. Area denominators come from the supplied reference extract and are not independently verified.
5. State changes: (area_2021 - area_2003) / area_2003 x 100, or hectare difference. Jurisdictions absent from official endpoints are omitted rather than converting blank percentages to 0. Green/rust represents direction, not a judgement about environmental quality. The row order stays ranked by percentage change across unit switches for comparison stability.
6. Per resident: reserve hectares / supplied 2021 population x 1,000. Marks include only the 14 matched jurisdictions; zeros for absent reserves in the supplied population file are not treated as observations.
7. Share comparison: reserve hectares / matched national reserve total; population / all 16 supplied population jurisdictions. Exact positions are preserved even when they overlap; circle/diamond shapes, tooltips and the table support inspection without altering values.
8. Flood heatmap: flood_records / district_records x 100 for each of 88 state-year rows. The denominator is records available in this extract, not all districts nationally. Identical 0-100 colour limits allow cell comparison.
9. Flood map: 26 supplied districts in five states. Symbol area uses a linear 0-8 domain with a zero area origin. Position is a town-coordinate average, not a district boundary centroid or flood-event coordinate. Opacity preserves context when a state is selected.
10. Rainfall context: eight labelled state-year observations at a time, from the same supplied paired table. No fitted causal line. Annual means cannot capture storm timing or confounders.

## Visual principles (the How)

- Use common position and length for precise comparison, area for map frequency, and colour intensity for ordered proportions.
- Keep green for forest quantities, purple for population, blue for flood records, rust for decreases and grey for missing/secondary geography. Regional composition is a within-forest categorical palette with its own legend.
- Use proximity and a consistent header-chart-note sequence to group related information. Four chapter anchors limit navigation effort; shorter copy reduces back-and-forth sight lines.
- Establish hierarchy with restrained contrast, a serif story heading, sans-serif chart labels, direct data annotations and subdued background marks. No key measure is identifiable only by colour: text, signs, shapes or legends provide another channel.
- Provide native labelled controls, focus styles, a skip link, reduced-motion support and an exact-value table. On small screens paired charts stack and chart widths follow their containers. Accessible table coverage is strongest for the state comparisons; not every chart has a full textual data table.

## Supplied inputs retained but not used in the main story

`national_forest_deforestation_combined.csv` mixes a separate global forest-cover source with legal reserve records. Its scope cannot be reconciled here. `pahang_district_treecover_flood.csv` claims a Hansen raster / geoBoundaries overlay but provides no raw processing code. Both are preserved unchanged, with the earlier tree-cover spec archived in docs; neither contributes to headline metrics or active charts.

## Other provenance boundaries

Population: https://www.kaggle.com/datasets/thajegan76/malaysia-population . Town/state references: https://www.kaggle.com/datasets/mypapit/malaysiancity . Flood records: https://www.kaggle.com/datasets/rajatjurel/malaysia-flood-dataset2000-2010 . These are source links recorded in the original project, not independently reconstructed raw-to-derived pipelines. The bundled GeoJSON lacks embedded provider/licence metadata. This remains an explicit publication-readiness limit; no provider or permission has been invented.

## Reproducibility

`prepare_and_validate.py` rebuilds three display datasets without editing the original inputs. Hashes record unchanged originals. Browser tests inspect compiled chart specs, view rendering, mobile bounds, state focus, metric switches, subset controls, table rows, exports and exact display positions. Passing those checks does not establish authenticity or completeness of raw observations.
