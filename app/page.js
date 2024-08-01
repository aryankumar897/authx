"use client"
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      backgroundImage: 'url(/image/auth2.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        textAlign: 'center',
        padding: '20px',
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '20px',
        }}>Secure Your Future</h1>
        <p style={{
          fontSize: '1.5rem',
          marginBottom: '40px',
        }}>“The only way to achieve the impossible is to believe it is possible.”</p>
        <button style={buttonStyle}
          onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
          onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
          onClick={handleLoginClick}
        >Login</button>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '15px 30px',
  fontSize: '1.2rem',
  color: '#fff',
  background: 'linear-gradient(135deg, #6e8efb, #ff1a1a)',
  border: 'none',
  borderRadius: '30px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  outline: 'none',
};

const buttonHoverStyle = {
  background: 'linear-gradient(135deg, #a777e3, #e60000)',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
};
