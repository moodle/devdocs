import React from 'react';
import Admonition from "@theme/Admonition";
import Link from '@docusaurus/Link';
import SchoolIcon from '@mui/icons-material/School';
import courseList from '@site/academyCourses';
import { Tooltip } from "@mui/material";

export default function AcademyLink(props) {
  const courseName = props.courseName;
  if (!courseList.courses[courseName]) {
    throw Error(`Unknown course ${courseName}`);
  }

  const Course = courseList.courses[courseName];


  return (
    <Admonition
      type="info"
      icon={
        <SchoolIcon fontSize="inherit" />
      }
      title="Learn more on Moodle Academy"
    >
      You can learn more about <strong>{ props.subject }</strong> from the <Tooltip
        title={ Course.summary }
      ><Link
        to={ courseList.siteHome + 'course/view.php?id=' + Course.id }
      >{ Course.name }</Link></Tooltip> on Moodle Academy.
    </Admonition>
  );
}
