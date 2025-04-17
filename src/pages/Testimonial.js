import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../pages/Testimonial.css';

import bgImg from '../assets/images/testimonial.jpg';
import client1 from '../assets/images/testimonial-2.jpg';
import client2 from '../assets/images/testimonial-4.jpg';
import client3 from '../assets/images/testimonial-3.jpg'; // Replace with actual image
import client4 from '../assets/images/testimonial-1.jpg'; // Replace with actual image
import client5 from '../assets/images/testimonial-5.jpg'; // Replace with actual image

import dogBed from '../assets/images/dogbed.jpg';
import dogsPlay from '../assets/images/2dogsplay.jpg';
import kittens from '../assets/images/kittens.jpg';
import { FaCheckCircle } from 'react-icons/fa';

// Testimonial data
const testimonials = [
  {
    name: 'John Doe',
    message:
      'This place is amazing! My dog loves it here, and I can tell the staff really care about the animals.',
    image: client1,
  },
  {
    name: 'Jane Smith',
    message:
      'Fantastic daycare! My cat always comes home happy. Highly recommend their services to any pet owner.',
    image: client2,
  },
  {
    name: 'Michael Johnson',
    message:
      'The team here is so friendly and professional. I trust them completely with my pets!',
    image: client3,
  },
  {
    name: 'Emily Davis',
    message:
      'Super clean, super friendly, and my dog always has a blast. I wouldn’t go anywhere else!',
    image: client4,
  },
  {
    name: 'Robert Lee',
    message:
      'Excellent services and a caring staff. My pets are always excited to visit!',
    image: client5,
  },
];

function Testimonial() {
  return (
    <>
      {/* Testimonial Section */}
      <div
        className="testimonial-wrapper"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '6rem 2rem',
        }}
      >
        {/* Centered Heading */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h3 style={{ color: '#28a745', fontSize: '1.2rem' }}>Testimonial</h3>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold' }}>
            Our <span style={{ color: '#000' }}>Client</span>{' '}
            <span style={{ color: '#f25c2a' }}>Says</span>
          </h2>
        </div>

        {/* Carousel */}
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 4000 }}
            loop={true}
            pagination={{ clickable: true }}
          >
            {testimonials.map((t, index) => (
              <SwiperSlide key={index}>
                <div
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    padding: '2rem',
                    maxWidth: '900px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                >
                  {/* Client Top Section */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={t.image}
                      alt={t.name}
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                    <div>
                      <h4 style={{ margin: 0, fontWeight: 'bold' }}>{t.name}</h4>
                      <p style={{ fontStyle: 'italic', color: '#666', margin: 0 }}>Pet Owner</p>
                    </div>
                  </div>

                  {/* Testimonial Message */}
                  <p
                    style={{
                      fontSize: '1rem',
                      lineHeight: '1.6',
                      color: '#333',
                      marginTop: '1rem',
                    }}
                  >
                    {t.message}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Boarding & Daycare Section */}
      <div
        className="boarding-wrapper"
        style={{
          backgroundColor: '#f8f8f8',
          padding: '6rem 2rem',
        }}
      >
        <div
          className="boarding-container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* Left Text Content */}
          <div style={{ flex: '1 1 45%', marginBottom: '2rem', minWidth: '300px' }}>
            <h2 style={{ fontSize: '2.8rem', fontWeight: 700 }}>
              <span style={{ color: '#f25c2a' }}>Boarding</span> &{' '}
              <span style={{ color: '#28a745' }}>Daycare</span>
            </h2>
            <p style={{ color: '#444', margin: '1rem 0' }}>
              Amet stet amet ut. Sit no vero vero no dolor. Sed erat ut sea. Just clita ut stet kasd at diam sit erat vero sit.
            </p>
            <p style={{ color: '#444' }}>
              Dolores lorem lorem ipsum sit et ipsum. Sadip sea amet diam dolore sed et. Sit rebum labore sit sit ut vero no sit. Et elitr stet dolor sed sit et sed ipsum et kasd ut.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <FaCheckCircle color="#28a745" style={{ marginRight: '0.5rem' }} />
                <strong>Best In Industry</strong>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <FaCheckCircle color="#28a745" style={{ marginRight: '0.5rem' }} />
                <strong>Emergency Services</strong>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <FaCheckCircle color="#28a745" style={{ marginRight: '0.5rem' }} />
                <strong>24/7 Customer Support</strong>
              </li>
            </ul>

            <button
              style={{
                backgroundColor: '#f25c2a',
                border: 'none',
                padding: '12px 24px',
                color: 'white',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background 0.3s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e55322')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f25c2a')}
            >
              Learn More
            </button>
          </div>

          {/* Right Image Layout */}
          <div
            style={{
              flex: '1 1 45%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              minWidth: '300px',
            }}
          >
            <img
              src={dogBed}
              alt="Dog in bed"
              style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <img
                src={dogsPlay}
                alt="Dogs playing"
                style={{ width: '50%', borderRadius: '8px', objectFit: 'cover' }}
              />
              <img
                src={kittens}
                alt="Kittens"
                style={{ width: '50%', borderRadius: '8px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Testimonial;
