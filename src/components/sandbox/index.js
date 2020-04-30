/* eslint-disable react/prop-types */
import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';

import UhOh from '../uhoh';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody,
  InpageBodyInner
} from '../common/Inpage';
import Prose from '../../styles/type/prose';
import Button from '../../styles/button/button';
import ButtonGroup from '../../styles/button/group';

import BtnExample from './buttons';
import FormsExample from './forms';
import InteractiveExample from './interactive';
import ColorsExample from './colors';

// How to add a new sandbox page.
// 1) Create an example component with the code inside the sandbox folder.
// 2) Add an entry to the sandboxPages array, with a name for the tab, a url
// and the component to render.
// 3) Profit!
const sandboxPages = [
  {
    name: 'Buttons',
    url: '/buttons',
    cmp: BtnExample
  },
  {
    name: 'Colors',
    url: '',
    cmp: ColorsExample
  },
  {
    name: 'Forms',
    url: '/forms',
    cmp: FormsExample
  },
  {
    name: 'Interactive',
    url: '/interactive',
    cmp: InteractiveExample
  }
];

export default class Sandbox extends React.Component {
  tabButton(page) {
    return (
      <Button
        key={page.url}
        as={NavLink}
        exact
        variation="base-raised-light"
        to={this.computePath(page)}
      >
        {page.name}
      </Button>
    );
  }

  computePath(p) {
    const { path } = this.props.match;
    return `${path}${p.url.substr(path.endsWith('/') ? 1 : 0)}`;
  }

  render() {
    if (process.env.NODE_ENV !== 'development') return <UhOh />;

    return (
      <Inpage>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <InpageTitle>Sandbox</InpageTitle>
            </InpageHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <InpageBodyInner>
            <Prose>
              <ButtonGroup orientation="horizontal">
                {sandboxPages.map(p => this.tabButton(p))}
              </ButtonGroup>
              <hr />
              <Switch>
                {sandboxPages.map(p => (
                  <Route
                    exact
                    key={p.url}
                    path={this.computePath(p)}
                    component={p.cmp}
                  />
                ))}
              </Switch>
            </Prose>
          </InpageBodyInner>
        </InpageBody>
      </Inpage>
    );
  }
}
