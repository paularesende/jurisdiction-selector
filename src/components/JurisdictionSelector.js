import React, { useState, useEffect } from 'react';
import { fetchJurisdictions } from '../api/fakeJurisdictionsApi';

const JurisdictionSelector = () => {
    const [jurisdictions, setJurisdictions] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const handleJurisdictionChange = (e) => {
        const jurisdictionId = e.target.name;
        const isChecked = e.target.checked;
        setSelected(prev => ({ ...prev, [jurisdictionId]: isChecked }));
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
                                name={jurisdiction.id}
                                checked={selected[jurisdiction.id] === true}
                                onChange={handleJurisdictionChange}
                            />
                            {jurisdiction.name}
                        </label>
                    </div>
                ))
            )}
        </div>
    );
};

export default JurisdictionSelector;