import React from 'react';

export const JsonLdSchema: React.FC = () => {
  const storeSchema = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'Saga Fabrics',
    legalName: 'Saga Fabrics',
    url: 'https://sagafabrics.in',
    logo: 'https://res.cloudinary.com/dnd8u5sll/image/upload/v1787209605/saga-fabrics-logo-new_skmnli.png',
    image: 'https://res.cloudinary.com/dnd8u5sll/image/upload/v1787209605/saga-fabrics-logo-new_skmnli.png',
    description: 'Shop 100% pure cotton Lucknowi Chikankari suits, kurtis & Handblock unstitched suit sets. Handcrafted artisanal embroidery, free express shipping across India.',
    email: 'saga.fabricss@gmail.com',
    telephone: '+91-7023352132',
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Credit Card, Debit Card, Net Banking',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'A305, Ashadeep Green Avenue Apartment, Jagatpura',
      addressLocality: 'Jaipur',
      addressRegion: 'Rajasthan',
      postalCode: '302017',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 26.8228,
      longitude: 75.8648,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      opens: '09:00',
      closes: '19:00',
    },
    sameAs: [
      'https://sagafabrics.in',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Saga Fabrics',
    url: 'https://sagafabrics.in',
    description: 'Authentic Lucknowi Chikankari Suits & Kurtis Online & Handblock Sets.',
    publisher: {
      '@type': 'Organization',
      name: 'Saga Fabrics',
      url: 'https://sagafabrics.in',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
};
