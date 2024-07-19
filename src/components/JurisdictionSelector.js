import React, { useState, useEffect } from 'react';
import { fetchJurisdictions } from '../api/fakeJurisdictionsApi';

const JurisdictionSelector = () => {
    const [jurisdictions, setJurisdictions] = useState([]);
    const [loading, setLoading] = useState(true);

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
                            <input type="checkbox" value={jurisdiction.id} name={jurisdiction.id} />
                            {jurisdiction.name}
                        </label>
                    </div>
                ))
            )}
        </div>
    );
};

export default JurisdictionSelector;