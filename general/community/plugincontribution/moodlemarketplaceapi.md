---
title: Moodle Marketplace API
sidebar_position: 2
sidebar_label: Moodle Marketplace API
tags:
  - Guidelines for contributors
  - Plugins
  - Plugin documentation
  - Moodle Marketplace
---

Use the Moodle Marketplace API to access Moodle Marketplace data and automate tasks such as submitting new plugin versions.

This guide explains how to authenticate with the API, submit plugin versions and automate plugin version submission from CI.

---

## Contents

- [Authentication](#authentication)
- [Conventions](#conventions)
- [Add a new plugin version](#add-a-new-plugin-version)
- [API limitations](#api-limitations)

---

## Authentication

All Moodle Marketplace API endpoints require a bearer token.

### Create an API token

1. Log in to Moodle Marketplace.
2. Go to **Account → Security** (https://marketplace.moodle.com/account/security).
3. Under **API tokens**, create a token. Give it a name you'll recognise and, optionally, set an expiry date.

> **Save your token when you create it.** The token is shown only once and is available for 60 seconds. If you lose it, you'll need to revoke it and create a new one.

You can have up to 10 active API tokens.

Treat API tokens like passwords. A token has the same access to Moodle Marketplace as the account that created it.

### Use an API token

Include the token as a bearer token in the `Authorization` header:

```text
Authorization: Bearer YOUR_TOKEN
```

### Troubleshoot authentication

A missing, malformed, expired or revoked token returns a `401` response from the API rather than redirecting you to the login page.

If you receive an unexpected `401`, check that:

- the token has not expired or been revoked
- your HTTP client is not removing the `Authorization` header when following a redirect

---

## Conventions

### Content type

All responses use `application/json`.

### Dates

Dates use ISO 8601 format with a timezone offset:

```text
2025-08-21T14:03:00+00:00
```

---

## Add a new plugin version

Use this endpoint to submit a new version of a plugin you maintain:

```text
POST https://marketplace.moodle.com/api/plugins/{frankenstyle}/versions
```

You must be a maintainer of the plugin. Requests use `multipart/form-data`.

You can submit a plugin ZIP package either by uploading the file or providing a URL.

### Upload a plugin ZIP package

```bash
curl -s -X POST \
     -H "Authorization: Bearer $MKPL_TOKEN" \
     -F "file=@mod_quiz.zip" \
     -F "releaseNotes=Fixes the grade calculation for group submissions" \
     -F "vcsTag=v1.4.0" \
     "https://marketplace.moodle.com/api/plugins/mod_quiz/versions"
```

### Submit a plugin ZIP package by URL

If the plugin ZIP package is already available online, provide its URL and Moodle Marketplace will retrieve it:

```bash
curl -s -X POST \
     -H "Authorization: Bearer $MKPL_TOKEN" \
     -F "fileUrl=https://github.com/example/moodle-mod_quiz/releases/download/v1.4.0/mod_quiz.zip" \
     "https://marketplace.moodle.com/api/plugins/mod_quiz/versions"
```

The URL must use `https` and resolve to a publicly accessible address.

### What you send, and what you must not

Submit a plugin ZIP package using **either** `file` or `fileUrl`. If you provide both or neither, the API returns a `422` response.

Moodle Marketplace gets the following information from the package's `version.php` file:

- build number
- release name
- maturity
- supported Moodle versions

You can't provide or override these values through the API.

The following fields are optional:

| Field | Description |
| --- | --- |
| `releaseNotes` | What changed in this release |
| `vcsRepositoryUrl` | Repository the package was built from |
| `vcsBranch` | Branch the package was built from |
| `vcsTag` | Tag the package was built from |

### Response

A successful submission returns a `201` response with the created version:

```json
{
  "id": 871,
  "version": "2025082100",
  "releaseName": "1.4.0",
  "maturity": "STABLE",
  "status": "in_testing",
  "moodleVersions": ["4.5", "5.0"],
  "releaseNotes": "Fixes the grade calculation for group submissions",
  "vcsTag": "v1.4.0",
  "createdAt": "2025-08-21T14:03:00+00:00"
}
```

The `status` is `in_testing`, not `uploaded`. Submitting a version immediately queues it for automated prechecks, so `uploaded` is an internal status that you won't see. Do not poll for it.

### If it fails

| Status | Cause |
| --- | --- |
| `403` Forbidden | You don't maintain this plugin. |
| `404` Not found | No plugin exists with this frankenstyle. |
| `409` Conflict | The plugin is in a state that does not accept new versions. |
| `422` Unprocessable Content | Both `file` and `fileUrl` were provided, or neither was provided. |
| `422` Unprocessable Content | The file isn't a ZIP file or doesn't contain a valid `version.php`. |
| `422` Unprocessable Content | The build number already exists for this plugin. |
| `422` Unprocessable Content | `fileUrl` doesn't use `https`, is unreachable or doesn't resolve to a public address. |
| `422` Unprocessable Content | The plugin ZIP package exceeds the Moodle Marketplace size limit. |

If a submission fails, no version is created. Fix the issue and submit the version again.

---

### Automate plugin version submission from CI

You can use the Moodle Marketplace API to submit a new plugin version automatically as part of a continuous integration (CI) workflow.

:::info

For releasing a new plugin version using GitHub Actions, follow the setup instructions at [moodlehq/moodle-plugin-release](https://github.com/moodlehq/moodle-plugin-release)

:::

The following example shows a basic release job:

```bash
#!/usr/bin/env bash
set -euo pipefail

: "${MKPL_TOKEN:?set MKPL_TOKEN}"      # a secret in your CI settings, never in the repo
PLUGIN_FRANKENSTYLE="mod_quiz"
BASE=https://marketplace.moodle.com/api

response=$(curl -sS -w '\n%{http_code}' -X POST \
  -H "Authorization: Bearer $MKPL_TOKEN" \
  -F "file=@build/mod_quiz.zip" \
  -F "releaseNotes=$(git tag -l --format='%(contents)' "$GIT_TAG")" \
  -F "vcsRepositoryUrl=$REPO_URL" \
  -F "vcsTag=$GIT_TAG" \
  "$BASE/plugins/$PLUGIN_FRANKENSTYLE/versions")

status=$(tail -n1 <<<"$response")
body=$(sed '$d' <<<"$response")

if [[ "$status" != "201" ]]; then
  echo "Submission failed ($status):" >&2
  jq -r '.violations[]? | "  \(.propertyPath): \(.message)"' <<<"$body" >&2 || echo "$body" >&2
  exit 1
fi

echo "Submitted version $(jq -r .version <<<"$body"), status $(jq -r .status <<<"$body")"
```

### Recommendations

- **Store the token as a CI secret.** Never store it in the repository. Give the token a name that identifies the pipeline so you can revoke it independently if the pipeline is compromised.
- **Fail the job on any response other than `201`.** Print `violations` to show the reason for the failure.
- **Do not retry a `422` response.** The request will fail again without changes. Retry only `5xx` responses and connection errors.
- **Submitting is not publishing.** A `201` response means the version has been accepted for automated prechecks.

---

## API limitations

- **Editing versions:** You cannot edit a version through the API after submitting it. To correct version information, edit the version in Moodle Marketplace.
- **Plugin ZIP package size:** The same size limit applies as when uploading a plugin ZIP package through Moodle Marketplace. If the package exceeds the limit, the API returns a `422` response.
- **Remote file retrieval:** Moodle Marketplace stops trying to retrieve a file after 10 seconds or as soon as it exceeds the size limit. If the host is slow, upload the plugin ZIP package instead.

:::tip

Something missing or not working as expected? [Contact](https://moodle.atlassian.net/servicedesk/customer/portal/166) the Moodle Marketplace team. The API is still evolving, and your feedback can help shape future improvements.

:::
