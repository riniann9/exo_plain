# Poster generation

render-pdf.mjs prints posters/source/professional-a0.html with Playwright and Chrome, writing to posters/exports/pdf.

build-pptx.mjs uses the original @oai/artifact-tool runtime and presentation helper files to generate the editable deck in posters/exports/pptx. Its runtime helper paths currently reflect the original authoring environment. The existing exports remain usable without those dependencies. Intermediate output goes to archive/poster-build/pptx.

Both scripts resolve the repository root relative to their own location. Install or provide their required Node dependencies before regenerating. Machine-specific node_modules links are local-only and are not committed.
