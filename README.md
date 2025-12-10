# Library Resources (GitHub Pages)

This site renders a searchable, filterable view of the published CSV data without modifying the spreadsheet.

## Data Source
- CSV: https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4sY19hjNQq0s6tZTeFb77Rv_QcWVOKxwf2dASHdoQniG2XoQYPht1qYDKZGqoZ2BBHS5nbjcFIkJ/pub?output=csv

## Features
- Global search across all columns.
- Subject and Grade dropdown filters (appear automatically when those columns exist).
- Clickable links for the resource URL column.

## Running
- Open `index.html` via a simple HTTP server (or visit the GitHub Pages URL once enabled). Example: `python -m http.server 8000`.
- No build step required; everything is static.

## Deployment
- GitHub Pages: branch `main`, folder `/` (root).
- Page will serve from `https://samlrn.github.io/aiplay.github.io/` once Pages is enabled.
