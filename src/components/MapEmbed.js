// src/components/MapEmbed.js
import React from 'react';

const MapEmbed = ({ mapLink }) => {
  const getEmbedUrl = (link) => {
    try {
      const url = new URL(link);
      const embedBaseUrl = 'https://www.google.com/maps/embed';
      const queryParams = new URLSearchParams();

      if (url.searchParams.has('q')) {
        queryParams.set('q', url.searchParams.get('q'));
      } else if (url.pathname.includes('/place/')) {
        queryParams.set('place_id', url.pathname.split('/')[2]);
      } else {
        return '';
      }

      const apiKey = 'YOUR_API_KEY'; // Thay bằng API Key của bạn
      queryParams.set('key', apiKey);

      return `${embedBaseUrl}?${queryParams.toString()}`;
    } catch (error) {
      return '';
    }
  };

  return (
    <iframe
      src={getEmbedUrl(mapLink)}
      width="600"
      height="450"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Map"
    ></iframe>
  );
};

export default MapEmbed;
