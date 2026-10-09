# License

This repository contains a talk, *Migrating ArcGIS Server Extensions to the 21st Century* (Esri European Developer & Technology Summit 2026). Different parts are under different terms:

| Part | License |
| --- | --- |
| Source code: `src/`, `scripts/`, the configuration files | [MIT](#mit-license-code) |
| Talk content: slide text, speaker notes, figures, data, documentation | [CC BY 4.0](#creative-commons-attribution-40-content) |
| Third-party material: logos, trademarks, excerpts | [Not licensed here](#third-party-material-and-trademarks) |

---

## MIT License (code)

Copyright (c) 2026 Antonín Procházka

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## Creative Commons Attribution 4.0 (content)

Copyright (c) 2026 Antonín Procházka

The talk content is licensed under the **Creative Commons Attribution 4.0 International License** (CC BY 4.0). You may share and adapt it for any purpose, including commercially, as long as you give appropriate credit, link to the license, and indicate if changes were made.

- Summary: https://creativecommons.org/licenses/by/4.0/
- Full legal code: https://creativecommons.org/licenses/by/4.0/legalcode

Suggested attribution: *"Migrating ArcGIS Server Extensions to the 21st Century" by Antonín Procházka, CC BY 4.0, https://github.com/prochan2/esri-eu-dev-tech-2026*

---

## Third-party material and trademarks

Neither license above covers the following. They remain with their owners:

- **Excerpts of CETIN a.s. source code and build output** (project files, build code, version strings, statistics) shown in the talk and in `src/deck/data/` and `src/deck/snippets.ts`. They are © CETIN a.s., anonymised, and included as illustrations.
- **The CETIN logo** (`public/brand/cetin-logo*.svg`) is a trademark of CETIN a.s.
- **Esri artwork and logos** from the summit speaker template (© Esri) are not in this repository. They are git-ignored and loaded from `public/private/` only when present. See `private/README.md`.
- **Product logos** come from [Simple Icons](https://simpleicons.org/) (CC0 1.0). The marks are trademarks of their respective owners: Esri/ArcGIS, Microsoft/.NET/NuGet, GitLab, Docker, the Linux Foundation, Git, the OpenAPI Initiative, Scalar, GitHub, Anthropic and OpenAI. They are used only to name the products and imply no endorsement.
- **Screenshots** of internal tools are not part of this repository.

Dependencies installed through npm keep their own licenses. One example is GSAP under the GreenSock Standard License.
