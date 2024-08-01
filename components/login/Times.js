import { useSession, signOut } from "next-auth/react";

const Profile = () => {
    const { data, loading } = useSession();

    if (loading) return <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>;

    if (!data) {
        return <p style={{ color: 'white', textAlign: 'center' }}>You need to be authenticated to view this page.</p>;
    }

    return (
        <div style={{ color: 'white', textAlign: 'center' }}>
            <h1>User Profile</h1>
            <p>Email: {data.user.email}</p>
            <h2>Login Times</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {data.user.loginTimes.length > 0 ? (
                    data.user.loginTimes.map((time, index) => (
                        <li key={index}>{new Date(time).toLocaleString()}</li>
                    ))
                ) : (
                    <p>No login times available.</p>
                )}
            </ul>
            <button onClick={() => signOut()} style={{ color: 'white', backgroundColor: 'black', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>
                Sign Out
            </button>
        </div>
    );
};

export default Profile;
