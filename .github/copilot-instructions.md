# Moodle DevDocs — Copilot Instructions

## Repository structure

This is a Docusaurus-based documentation site for Moodle developers.

Content is broken into several broad areas:

1. **Documentation for specific versions of Moodle** — guides, best practices, and reference material for Moodle developers. This is the main content of the site and lives in `docs/` and `versioned_docs/`.
2. **General documentation for Moodle developers** — this is the main content of the site and lives in `general/`.
3. **Site configuration and tooling** — this includes Docusaurus config files, build scripts, and other tooling. This lives in the root of the repository and `scripts/`.
4. **Documentation for the Moodle App** - this is a separate section of the site, and lives in:
   - `general/app/`
   - `general/app.md`
   - `general/app_releases/`
   - `general/app_releases.md`

5. **Documentation for Moodle for Workplace** - this is a separate section of the site, and lives in:
   - `general/workplace/`

## Specific instructions

### Documentation for specific versions of Moodle

The version-specific content lives in two parallel trees:

| Path | Purpose |
|------|---------|
| `docs/` | Current (unreleased/next) version |
| `versioned_docs/version-4.1/` | Moodle 4.1 |
| `versioned_docs/version-4.4/` | Moodle 4.4 |
| `versioned_docs/version-4.5/` | Moodle 4.5 |
| `versioned_docs/version-5.0/` | Moodle 5.0 |
| `versioned_docs/version-5.1/` | Moodle 5.1 |
| `versioned_docs/version-[other-future-version]/` | Moodle [other-future-version] |

The same document can exist in every version. Relative paths are identical across versions — only the version prefix differs. For example:

- `docs/apis/core/hooks/index.md`
- `versioned_docs/version-5.1/apis/core/hooks/index.md`
- `versioned_docs/version-5.0/apis/core/hooks/index.md`

#### Backporting rules

When reviewing or creating a PR that touches `docs/` or `versioned_docs/`:

1. **Check every other version** for the same file path. A fix to a factual error, broken example, or incorrect documentation almost always applies to all versions where that page exists.

2. **Flag missing backports.** If a PR only changes one version but the same issue exists in other versions, the PR is incomplete. Raise this in your review.

3. **Exceptions** — a change does NOT need backporting if:
   - It describes a feature that does not exist in that older version (check for a `<Since .../>` inline MD/MDX component in the document body, using either a `version` or `versions` prop, for example `<Since version="X.Y" />` or `<Since versions={["X.Y", "Z.W"]} />`).
   - The file does not exist in that version.
   - It is a structural/navigation change that is version-specific.

4. **For new PRs you are asked to create**, always update all impacted versions in one PR.

#### PR review checklist (backport completeness)

When reviewing a documentation PR, always check:

- [ ] Does the changed file exist in other versioned directories?
- [ ] Does the same problem exist in those other versions?
- [ ] If yes to both, are those files also updated in this PR?

If any backports are missing, request them before approving.

If possible suggest a patch to add the missing backports, or ask the author to add them.
