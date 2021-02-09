import React from 'react';
import { NhsCheckBox } from "../../components/NhsCheckBox";
import renderer from 'react-test-renderer';

describe("<NhsCheckBox>", () => {
it('displays no check when value=false', () => {
    const tree = renderer.create(<NhsCheckBox value={false} disabled={false} />);
    tree.root.findByType(NhsCheckBox).instance.setState();
    expect(tree).toMatchSnapshot();
});
it('displays a check when value=true', () => {
    const tree = renderer.create(<NhsCheckBox value={true} disabled={false} />);
    tree.root.findByType(NhsCheckBox).instance.setState();
    expect(tree).toMatchSnapshot();
});
});