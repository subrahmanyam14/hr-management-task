import React from 'react';

const Dashboard = () => {
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.headerText}>Dashboard</h1>
            </div>
            <div style={styles.body}>
                <h2>Welcome Admin Panel</h2>
            </div>
        </div>
    );
};

const styles = {
    container: {
        // border: '1px solid black',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        backgroundColor: 'yellow',
        padding: '10px',
        textAlign: 'left',
    },
    headerText: {
        margin: 0,
    },
    body: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'left',
        flexGrow: 1,
        fontSize: '18px',
    },
};

export default Dashboard;
