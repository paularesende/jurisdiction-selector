import React, { useState, useEffect } from 'react';
import './JurisdictionSelector.css';
import { Checkbox, FormControlLabel, List, ListItem, CircularProgress, Typography } from '@material-ui/core';
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
            return <CircularProgress />;
        }

        return (
            <div className='jurisdiction-sub'>
                {jurisdictionSubs?.map(subJurisdiction => (
                    <List key={subJurisdiction.id}>
                        <ListItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selected[subJurisdiction.id] === true}
                                        onChange={handleSubJurisdictionChange}
                                        value={subJurisdiction.id}
                                    />
                                }
                                label={subJurisdiction.name}
                            />
                        </ListItem>
                    </List>
                ))}
            </div>
        ) || null;
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div className="jurisdiction-selector">
            <Typography variant="h4">Select Jurisdictions</Typography>
            {jurisdictions.length === 0 ? (
                <Typography>No jurisdictions available</Typography>
            ) : (
                <List className="jurisdiction-container">
                    {jurisdictions.map(jurisdiction => (
                            <ListItem key={jurisdiction.id}>
                                <div>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selected[jurisdiction.id] === true}
                                                onChange={handleJurisdictionChange}
                                                value={jurisdiction.id}
                                            />
                                        }
                                        label={jurisdiction.name}
                                    />
                                    {selected[jurisdiction.id] && renderSubJurisdictions(jurisdiction.id)}
                                </div>
                                </ListItem>
                        ))}
                </List>
            )}
        </div>
    );
};

export default JurisdictionSelector;