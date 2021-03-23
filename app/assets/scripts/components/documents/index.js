import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { GlobalLoading } from '@devseed-ui/global-loading';

import App from '../common/app';
import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageActions,
  InpageBody
} from '../../styles/inpage';
import Constrainer from '../../styles/constrainer';
import DropdownMenu from '../common/dropdown-menu';
import { Link } from '../../styles/clean/link';

import { useAtbds } from '../../context/atbds-list';

const InpageBodyScroll = styled(InpageBody)`
  padding: 0;
  overflow: auto;

  ${Constrainer} {
    padding-top: 3rem;
    padding-bottom: 30rem;
  }
`;

function Documents() {
  const { fetchAtbds, atbds } = useAtbds();

  useEffect(() => {
    fetchAtbds();
  }, []);

  return (
    <App pageTitle='Documents'>
      {atbds.status === 'loading' && <GlobalLoading />}
      <Inpage>
        <InpageHeader>
          <InpageHeadline>
            <InpageTitle>Documents</InpageTitle>
          </InpageHeadline>
          <InpageActions>
            <Button to='/' variation='achromic-plain' title='Create new'>
              Create new
            </Button>
          </InpageActions>
        </InpageHeader>
        <InpageBodyScroll>
          <Constrainer>
            {atbds.status === 'succeeded' && atbds.data?.length && (
              <table>
                <thead>
                  <tr>
                    <th colSpan={2}>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {atbds.data.map((atbd) => {
                    const atbdVersions = [...atbd.versions].reverse();
                    const lastVersion = atbdVersions[0];

                    const versionMenu = {
                      id: 'versions',
                      items: atbdVersions.map((v) => ({
                        id: v.version,
                        label: v.version,
                        title: `View ${v.version} page`,
                        as: Link,
                        to: `/documents/${atbd.alias || atbd.id}/${v.version}`
                      }))
                    };

                    return (
                      <tr key={atbd.id}>
                        <td>
                          <p>
                            <Link
                              to={`/documents/${atbd.alias || atbd.id}/${
                                lastVersion.version
                              }`}
                            >
                              {atbd.title}
                            </Link>{' '}
                            ({lastVersion.status})
                          </p>

                          <DropdownMenu
                            menu={versionMenu}
                            triggerLabel={lastVersion.version}
                            withChevron
                            dropTitle='Atbd versions'
                          />
                        </td>
                        <td>Actions</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </Constrainer>
        </InpageBodyScroll>
      </Inpage>
    </App>
  );
}

export default Documents;
