/**
 * Copyright (c) Moodle Pty Ltd.
 *
 * Moodle is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Moodle is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import Admonition from '@theme/Admonition';
import { useDoc } from '@docusaurus/plugin-content-docs/client';

function DraftDocumentWithLink({ documentationDraft }) {
    return (
        <Translate
            id="documentation.inProgress.withLink"
            description="A banner used to indicate that the current page is a draft and requesting help"
            values={{
                seeTheIssue: (
                    <Link to={documentationDraft}>
                        <strong>
                            <Translate
                                id="documentation.inProgress.withLink.linkLabel"
                                description={'The label for the link to the issue describing '
                                    + ' this documentation work'}
                            >
                                See the issue
                            </Translate>
                        </strong>
                    </Link>
                ),
            }}
        >
            {'This documentation is currently in draft form. {seeTheIssue} to find out how you can help.'}
        </Translate>
    );
}

function DraftDocumentWithoutLink({ editUrl }) {
    return (
        <Translate
            id="documentation.inProgress"
            description="A banner used to indicate that the current page is a draft, but has no issue"
            values={{
                contributingEdits: (
                    <Link to={editUrl}>
                        <Translate
                            id="documentation.inProgress.editThisPage.linkLabel"
                            description="The label for a link on docs in draft form to encourage contributions."
                        >
                            contributing edits to this page
                        </Translate>
                    </Link>
                ),
            }}
        >
            {' This documentation is currently in-progress. You can help by {contributingEdits}.'}
        </Translate>
    );
}

function DraftNotice(props) {
    return (
        <Admonition
            type="caution"
            icon={
                <AutoFixHighIcon fontSize="inherit" />
            }
            title={
                translate({
                    message: 'Draft document',
                    description: 'A heading to indicate that the document is a draft',
                    id: 'documentation.inProgress.warning',
                })
            }
        >
            {props.children}
        </Admonition>
    );
}

export default function FrontMatterBannerDraft({ frontMatter }) {
    const { documentationDraft = null } = frontMatter;
    const { metadata } = useDoc();
    const { editUrl = null } = metadata;

    if (!documentationDraft) {
        // This is not a draft.
        return null;
    }

    if (typeof documentationDraft === 'string') {
        // This is a draft. The string value is a link to the issue relating to its creation.
        return (
            <DraftNotice>
                <DraftDocumentWithLink
                    documentationDraft={documentationDraft}
                />
            </DraftNotice>
        );
    }

    // This is a draft but no issue exists to track it. This can happen for placeholders for a short period.
    return (
        <DraftNotice>
            <DraftDocumentWithoutLink
                editUrl={editUrl}
            />
        </DraftNotice>
    );
}
