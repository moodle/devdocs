import React from 'react';
import { Stack, Chip } from "@mui/material";
import Link from '@docusaurus/Link';

export default function Since(props) {
  const badges = props.versions.map((version) => getSinceLabel(version, props.issueNumber));

  return (
    <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={2}
      >
      { badges }
    </Stack>
  );
}

const getSinceLabel = (versionNumber, issueNumber) => {
  if (typeof versionNumber === 'number' && Number.isInteger(versionNumber)) {
    versionNumber = versionNumber.toFixed(1);
  }

  let label = (
    <span>Since {versionNumber}</span>
  );

  const chip = (
    <Chip
        key={`Since${versionNumber}`}
        label={label}
      />
  );

  if (issueNumber) {
    return (
      <Link
          to={ "https://tracker.moodle.org/browse/" + issueNumber }
        >{chip}</Link>
    );
  }

  return chip;
};
