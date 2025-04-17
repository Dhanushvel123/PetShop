import React, { useState } from 'react';
import aboutImg from '../assets/images/about.jpg';
import offerBg from '../../src/assets/images/offer.jpg'; // Replace with your actual path if needed

function About() {
  const [activeTab, setActiveTab] = useState('mission');

  const missionContent = `Tempor erat elitr at rebum at at clita aliquyam consetetur. 
  Aliquyam diam amet diam et eos sadipscing labore. Clita erat ipsum et lorem et sit, 
  sed stet no labore lorem sit. Sanctus clita duo justo et tempor consetetur takimata 
  eirmod, dolores takimata consetetur invidunt magna dolores aliquyam dolores dolore. 
  Amet erat amet et magna.`;

  const visionContent = `Dolores sit amet sanctus clita. Rebum tempor eos lorem accusam, 
  diam ipsum clita duo dolores magna sit erat. Magna kasd duo sed ipsum et lorem lorem 
  diam tempor. Labore justo eos et diam kasd sed. Tempor stet justo rebum stet sit 
  gubergren amet.`;

  return (
    <div>
      {/* 🐾 About Section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem',
          backgroundColor: '#fff',
          flexWrap: 'wrap',
        }}
      >
        {/* Image */}
        <div style={{ flex: '1 1 400px', padding: '1rem' }}>
          <img
            src={aboutImg}
            alt="Happy dogs"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          />
        </div>

        {/* Content */}
        <div style={{ flex: '1 1 500px', padding: '1rem' }}>
          <h5 style={{ color: '#7bbf42', fontWeight: '600' }}>ABOUT US</h5>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            WE KEEP YOUR PETS HAPPY ALL TIME
          </h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#555' }}>
            Diam dolor diam ipsum tempor sit. Clita erat ipsum et lorem stet no labore lorem sit clita duo justo magna dolore
          </p>
          {/* Toggle Block */}
          <div
            style={{
              backgroundColor: '#f3f3f3',
              padding: '1.5rem',
              borderRadius: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <button
                onClick={() => setActiveTab('mission')}
                style={{
                  backgroundColor: activeTab === 'mission' ? '#7bbf42' : '#e0e0e0',
                  color: activeTab === 'mission' ? '#fff' : '#333',
                  border: 'none',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                OUR MISSION
              </button>
              <button
                onClick={() => setActiveTab('vision')}
                style={{
                  backgroundColor: activeTab === 'vision' ? '#7bbf42' : 'transparent',
                  color: activeTab === 'vision' ? '#fff' : '#7bbf42',
                  border: activeTab === 'vision' ? 'none' : '1px solid #7bbf42',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                OUR VISION
              </button>
            </div>

            <p style={{ color: '#666' }}>
              {activeTab === 'mission' ? missionContent : visionContent}
            </p>
          </div>
        </div>
      </div>

      {/* 🔥 Special Offer Section */}
      <div
        style={{
          backgroundImage: `url(${offerBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          color: '#fff',
          position: 'relative',
        }}
      >
        <div
          style={{
            marginLeft: '4rem',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // optional overlay for readability
          }}
        >
          <p style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>SPECIAL OFFER</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            SAVE 50% ON ALL ITEMS<br />YOUR FIRST ORDER
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Eirmod sed tempor lorem ut dolores sit kasd ipsum. Dolor ea et dolore et at sea ea at dolor justo ipsum duo rebum sea.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#fff',
              color: '#000',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}>
              SHOP NOW
            </button>
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              color: '#fff',
              fontWeight: 'bold',
              border: '1px solid #fff',
              borderRadius: '4px',
              cursor: 'pointer',
            }}>
              READ MORE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
