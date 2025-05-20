import React from 'react';
import {
  FaHome,
  FaBone,
  FaCut,
  FaDog,
  FaDumbbell,
  FaShieldAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../pages/Services.css';

// Team images
import team1 from '../assets/images/team-1.jpg';
import team2 from '../assets/images/team-2.jpg';
import team3 from '../assets/images/team-3.jpg';
import team4 from '../assets/images/team-4.jpg';
import team5 from '../assets/images/team-5.jpg';

const services = [
  { icon: <FaHome size={40} />, title: 'Pet Boarding', desc: 'Kasd dolor no lorem sit tempor at justo rebum stet justo elitr dolor amet sit' },
  { icon: <FaBone size={40} />, title: 'Pet Feeding', desc: 'Kasd dolor no lorem sit tempor at justo rebum stet justo elitr dolor amet sit' },
  { icon: <FaCut size={40} />, title: 'Pet Grooming', desc: 'Kasd dolor no lorem sit tempor at justo rebum stet justo elitr dolor amet sit' },
  { icon: <FaDog size={40} />, title: 'Pet Training', desc: 'Kasd dolor no lorem sit tempor at justo rebum stet justo elitr dolor amet sit' },
  { icon: <FaDumbbell size={40} />, title: 'Pet Exercise', desc: 'Kasd dolor no lorem sit tempor at justo rebum stet justo elitr dolor amet sit' },
  { icon: <FaShieldAlt size={40} />, title: 'Pet Treatment', desc: 'Kasd dolor no lorem sit tempor at justo rebum stet justo elitr dolor amet sit' },
];

const team = [
  { image: team1, name: 'Emily Johnson', role: 'Veterinarian' },
  { image: team2, name: 'Michael Brown', role: 'Trainer' },
  { image: team3, name: 'Jessica Lee', role: 'Grooming Expert' },
  { image: team4, name: 'David Wilson', role: 'Nutritionist' },
  { image: team5, name: 'Sarah Thompson', role: 'Spay/Neuter' },
];

function Services() {
  return (
    <div>
      {/* Services Section */}
      <div className="services-wrapper">
        <div className="services-content">
          <h5 className="services-subtitle">SERVICES</h5>
          <h1 className="services-title">OUR EXCELLENT PET CARE SERVICES</h1>
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                  <span className="read-more">READ MORE →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="team-section">
        <h2 className="team-title">Meet Our Expert Team</h2>
        <div className="team-carousel-wrapper">
          <Swiper
            modules={[Autoplay, Navigation]}
            slidesPerView={4}
            spaceBetween={30}
            loop={true}
            autoplay={{ delay: 3000 }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
          >
            {team.map((member, index) => (
              <SwiperSlide key={index}>
                <div className="team-card">
                  <div className="team-img" style={{ backgroundImage: `url(${member.image})` }}>
                    <div className="overlay">
                      <div className="social-icons">
                        <FaFacebookF />
                        <FaTwitter />
                        <FaInstagram />
                      </div>
                    </div>
                  </div>
                  <div className="team-info">
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-button-next"></div>
            <div className="swiper-button-prev"></div>
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default Services;
