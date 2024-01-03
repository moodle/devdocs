import React from 'react';
import {
    useNavbarMobileSidebar,
} from '@docusaurus/theme-common/internal';
import Logo from '@theme-original/Navbar/Logo';

export default function LogoWrapper(props) {
  const mobileSidebar = useNavbarMobileSidebar();

  if (!mobileSidebar.shouldRender) {
      return (
          <>
          </>
      );
  }

  return (
    <>
      <Logo {...props} />
    </>
  );
}
