import React from 'react';

export const JsonLdSchema: React.FC = () => {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Saga Fabrics',
    url: 'https://sagafabrics.in',
    logo: 'https://res.cloudinary.com/dnd8u5sll/image/upload/v1787209605/saga-fabrics-logo-new_skmnli.png',
    description: 'Saga Fabrics offers authentic handcrafted Chikankari & Handblock unstitched suit fabric sets with 100% pure cotton dupattas.',
    email: 'saga.fabricss@gmail.com',
    telephone: '+91-7023352132',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Hazratganj',
      addressLocality: 'Lucknow',
      addressRegion: 'Uttar Pradesh',
      postalCode: '226001',
      addressCountry: 'IN',
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
    description: 'Online store for handcrafted Chikankari & Handblock unstitched suit fabric sets.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
};
