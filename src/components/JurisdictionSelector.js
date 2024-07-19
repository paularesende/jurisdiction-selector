import React, { useState, useEffect } from 'react';
import { fetchJurisdictions, fetchSubJurisdictions } from '../api/fakeJurisdictionsApi';

const JurisdictionSelector = () => {
    const [subJurisdictions, setSubJurisdictions] = useState({});
    const [jurisdictions, setJurisdictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subLoading, setSubLoading] = useState({});
    const [selected, setSelected] = useState({});

    useEffect(() => {
        const loadJurisdictions = async () => {
            try {
                const fetchedJurisdictions = await fetchJurisdictions();
                setJurisdictions(fetchedJurisdictions);
            } catch (error) {
                console.error('Error fetching jurisdictions:', error);
            } finally {
                setLoading(false);
            }
        };
        loadJurisdictions();
    }, []);

    const handleJurisdictionChange = async (e) => {
        const jurisdictionId = e.target.value;
        const isChecked = e.target.checked;
        setSelected(prev => ({ ...prev, [jurisdictionId]: isChecked }));

        if (isChecked) {
            setSubLoading(prev => ({ ...prev, [jurisdictionId]: true }));

            try {
                const newSubJurisdictions = await fetchSubJurisdictions(jurisdictionId);
                setSubJurisdictions(prev => ({
                    ...prev,
                    [jurisdictionId]: newSubJurisdictions,
                }));
            } catch (error) {
                console.error('Failed to fetch sub-jurisdictions:', error);
            } finally {
                setSubLoading(prev => ({ ...prev, [jurisdictionId]: false }));
            }
        } else {
            setSubJurisdictions(prev => {
                const { [jurisdictionId]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleSubJurisdictionChange = (e) => {
        const subJurisdictionId = e.target.value;
        const isChecked = e.target.checked;

        setSelected(prev => ({
            ...prev,
            [subJurisdictionId]: isChecked,
        }));
    };

    const renderSubJurisdictions = (jurisdictionId) => {
        const jurisdictionSubs = subJurisdictions[jurisdictionId];

        if (subLoading[jurisdictionId]) {
            return <div>Loading sub-jurisdictions...</div>;
        }

        return jurisdictionSubs?.map(subJurisdiction => (
            <div key={subJurisdiction.id} style={{ marginLeft: '20px' }}>
                <label>
                    <input
                        type="checkbox"
                        value={subJurisdiction.id}
                        checked={selected[subJurisdiction.id] === true}
                        onChange={handleSubJurisdictionChange}
                    />
                    {subJurisdiction.name}
                </label>
            </div>
        )) || null;
    };

    if (loading) {
        return <div>Loading jurisdictions...</div>;
    }

    return (
        <div>
            <h2>Select Jurisdictions</h2>
            {jurisdictions.length === 0 ? (
                <div>No jurisdictions available</div>
            ) : (
                jurisdictions.map(jurisdiction => (
                    <div key={jurisdiction.id} style={{ marginBottom: '10px' }}>
                        <label>
                            <input
                                type="checkbox"
                                value={jurisdiction.id}
                                checked={selected[jurisdiction.id] === true}
                                onChange={handleJurisdictionChange}
                            />
                            {jurisdiction.name}
                        </label>
                        {selected[jurisdiction.id] && renderSubJurisdictions(jurisdiction.id)}
                    </div>
                ))
            )}
        </div>
    );
};

export default JurisdictionSelector;