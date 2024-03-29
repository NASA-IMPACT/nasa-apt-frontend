import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import md5 from 'md5';
import { themeVal } from '@devseed-ui/theme-provider';

const UserImageWrapper = styled.span`
  position: relative;
  display: block;
  overflow: hidden;

  &::before {
    position: absolute;
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    border-radius: ${themeVal('shape.ellipsoid')};
    box-shadow: inset 0 0 0 1px ${themeVal('color.baseAlphaB')};
  }

  &,
  img {
    border-radius: ${themeVal('shape.ellipsoid')};
  }

  img {
    display: block;
  }
`;

const getBG = (name) => {
  // Bg color is determined by last letter.
  const charCode = name.toUpperCase().charCodeAt(name.length - 1) - 65;

  if (charCode < 7) {
    return 'fe7f2d/ffffff';
  } else if (charCode < 14) {
    return 'fcca46/000000';
  } else if (charCode < 21) {
    return 'a1c181/000000';
  } else {
    return '619b8a/ffffff';
  }
};

const getPxSize = (size) => {
  if (size === 'profile') {
    return 128;
  } else if (size === 'small') {
    return 24;
  } else {
    return 32;
  }
};

function UserImage(props) {
  const { size, email, name } = props;

  const emailMd5 = md5(email || '');
  // Replace spaces with encoded + sign (%2B)
  const endName = name.replace(/ /g, '%2B') || '';
  const px = getPxSize(size);

  // https://eu.ui-avatars.com/
  const initialsAvatarUrl = `https://eu.ui-avatars.com/api/${endName}/${px}/${getBG(
    endName
  )}`;

  return (
    <UserImageWrapper>
      <img
        src={`https://www.gravatar.com/avatar/${emailMd5}?s=${px}&d=${initialsAvatarUrl}`}
        width={px}
        height={px}
      />
    </UserImageWrapper>
  );
}

UserImage.propTypes = {
  size: T.string,
  name: T.string,
  email: T.string
};

export default UserImage;
