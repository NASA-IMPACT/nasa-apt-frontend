import React from 'react';
import PropTypes from 'prop-types';
import { EmptySection } from '../document-body';
import SafeReadEditor from '../../../slate/safe-read-editor';
import styled from 'styled-components';
import { VariablePropType } from '../../../../types';

const TableElement = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const Th = styled.th`
  background-color: rgb(244, 245, 247);
  border: 1px solid rgb(193, 199, 208);
  padding: 8px;
  min-width: 48px;
  text-align: center;

  > * {
    margin: 0;
  }
`;

const Td = styled.td`
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(193, 199, 208);
  padding: 8px;
  min-width: 48px;

  > * {
    margin: 0;
  }
`;

const NameTd = styled(Td)`
  width: 150px;
`;

const UnitTd = styled(Td)`
  width: 100px;
`;

export const VariablesTable = ({ variables }) => {
  return (
    <TableElement>
      <thead>
        <Tr>
          <Th>Name</Th>
          <Th>Long Name</Th>
          <Th>Unit</Th>
        </Tr>
      </thead>
      <tbody>
        {variables.map((variable) => (
          <Tr key={variable.name.children[0].children[0].text}>
            <NameTd>
              <SafeReadEditor
                value={variable.name}
                whenEmpty={<EmptySection />}
              />
            </NameTd>
            <Td>
              <SafeReadEditor
                value={variable.long_name}
                whenEmpty={<EmptySection />}
              />
            </Td>
            <UnitTd>
              <SafeReadEditor
                value={variable.unit}
                whenEmpty={<EmptySection />}
              />
            </UnitTd>
          </Tr>
        ))}
      </tbody>
    </TableElement>
  );
};

VariablesTable.propTypes = {
  variables: PropTypes.arrayOf(VariablePropType).isRequired
};
