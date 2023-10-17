import React from 'react';
import {
  faGithub,
  faGoogle,
  faLinkedinIn,
  faOrcid,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { SocialButton } from './buttons/SocialButton';

const Footer = () => {
  return (
    <footer className="flex h-16 justify-center items-center gap-4 text-sm text-gray-500 flex-col pb-5">
      <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
        <SocialButton
          icon={faTwitter}
          link="https://twitter.com/ralebre/"
          newPage
          name="Twitter"
        />

        <SocialButton
          icon={faLinkedinIn}
          link="https://www.linkedin.com/in/rui-lebre-435279101/"
          newPage
          name="LinkedIn"
        />

        <SocialButton
          icon={faGithub}
          link="https://github.com/rlebre/"
          newPage
          name="Github"
        />

        <SocialButton
          icon={faOrcid}
          link="https://orcid.org/0000-0002-3230-0732"
          newPage
          name="Orcid"
        />

        <SocialButton
          icon={faGoogle}
          link="https://scholar.google.com/citations?user=WtJeCMMAAAAJ&hl=en-US"
          newPage
          name="Google Scholar"
        />
      </div>
      <div className="flex justify-center items-center gap-2">
        <span>Made with</span>
        <FontAwesomeIcon icon={faHeart} className="text-red-700 w-3" />
        <Link href="https://github.com/rlebre/" passHref>
          <div className="flex items-center gap-2 cursor-pointer">
            by Rui Lebre <FontAwesomeIcon icon={faGithub} className=" w-3" />
          </div>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
