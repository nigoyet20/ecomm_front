import React, { useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import './Service.scss';
import { ServiceI } from '../../../@types/service';

// Importations directes des icônes
import { FaApple, FaTools } from 'react-icons/fa';
import { TiTime } from 'react-icons/ti';
import { TbTruckDelivery } from 'react-icons/tb';

const iconMap = {
  FaApple,
  FaTools,
  TiTime,
  TbTruckDelivery,
};

interface ServiceCardProps {
  service: {
    title: string;
    description: string;
    icon: string;
    iconPackage: 'Fa' | 'Ti' | 'Tb';
  };
  index: number;
  setActiveIndex: (index: number) => void;
  isNavigatingRef: React.MutableRefObject<boolean>;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, setActiveIndex, isNavigatingRef }) => {
  const IconComponent = iconMap[service.icon as keyof typeof iconMap];
  const { ref } = useInView({
    threshold: 0.5,
    triggerOnce: false,
    onChange: (inView) => {
      if (inView && !isNavigatingRef.current) {
        setActiveIndex(index);
      }
    },
  });

  return (
    <div ref={ref} id={`service-${index}`} className="service_card">
      <div className="service_card_icon">
        {IconComponent && <IconComponent size={32} />}
      </div>
      <div className="service_card_content">
        <span className="service_card_content_title">{service.title}</span>
        <span className="service_card_content_description">{service.description}</span>
      </div>
    </div>
  );
};

const Service: React.FC<{ data: ServiceI['data'] }> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const isNavigatingRef = useRef(false);

  const handleNavigation = (index: number) => {
    isNavigatingRef.current = true;
    document.getElementById(`service-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setActiveIndex(index);
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 400);
  };

  return (
    <>
      <div className="service">
        {data.map((service, index) => (
          <ServiceCard
            key={index}
            service={service}
            index={index}
            setActiveIndex={setActiveIndex}
            isNavigatingRef={isNavigatingRef}
          />
        ))}
      </div>
      <div className="service_navigation">
        {data.map((_, index) => (
          <div
            key={index}
            className={`nav_dot ${activeIndex === index ? 'active' : ''}`}
            onClick={() => handleNavigation(index)}
          />
        ))}
      </div>
    </>
  );
};

export default Service;
