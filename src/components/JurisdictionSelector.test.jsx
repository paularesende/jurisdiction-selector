import { render, fireEvent, waitFor } from '@testing-library/react';
import JurisdictionSelector from './JurisdictionSelector';
import { fetchJurisdictions, fetchSubJurisdictions } from '../api/fakeJurisdictionsApi';

jest.mock('../api/fakeJurisdictionsApi');

describe('JurisdictionSelector', () => {
    it('renders without crashing', () => {
        render(<JurisdictionSelector />);
    });

    it('loads and displays jurisdictions', async () => {
        const fakeJurisdictions = [{ id: '1', name: 'fake juridiction'}];
        fetchJurisdictions.mockResolvedValue(fakeJurisdictions);

        const { getByText } = render(<JurisdictionSelector />);
        const listElement = await waitFor(() => getByText('fake juridiction'));

        expect(fetchJurisdictions).toHaveBeenCalledTimes(1);
        expect(listElement).toBeInTheDocument();
    });

    it('loads and displays sub-jurisdictions when a jurisdiction is selected', async () => {
        const fakeJurisdictions = [{ id: '1', name: 'fake juridiction'}];
        const fakeSubJurisdictions = [{ id: '1-1', name: 'fake sub-juridiction'}];

        fetchJurisdictions.mockResolvedValue(fakeJurisdictions);
        fetchSubJurisdictions.mockResolvedValue(fakeSubJurisdictions);

        const { getByText, getByLabelText } = render(<JurisdictionSelector />);
        const jurisdictionCheckbox = await waitFor(() => getByLabelText('fake juridiction'));
        fireEvent.click(jurisdictionCheckbox);
        const subJurisdictionElement = await waitFor(() => getByText('fake sub-juridiction'));

        expect(fetchJurisdictions).toHaveBeenCalledTimes(1);
        expect(fetchSubJurisdictions).toHaveBeenCalledWith('1');
        expect(subJurisdictionElement).toBeInTheDocument();
    });

    it('removes sub-jurisdictions when a jurisdiction is deselected', async () => {
        const fakeJurisdictions = [{ id: '1', name: 'fake juridiction'}];
        const fakeSubJurisdictions = [{ id: '1-1', name: 'fake sub-juridiction'}];

        fetchJurisdictions.mockResolvedValue(fakeJurisdictions);
        fetchSubJurisdictions.mockResolvedValue(fakeSubJurisdictions);

        const { getByText, getByLabelText, queryByText } = render(<JurisdictionSelector />);
        const jurisdictionCheckbox = await waitFor(() => getByLabelText('fake juridiction'));
        fireEvent.click(jurisdictionCheckbox);
        const subJurisdictionElement = await waitFor(() => getByText('fake sub-juridiction'));

        expect(subJurisdictionElement).toBeInTheDocument();

        fireEvent.click(jurisdictionCheckbox);

        expect(queryByText('fake sub-juridiction')).toBeNull();
    });
});