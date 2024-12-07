import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, Button, Space, Image, Row, Col } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';

// Đặt token Mapbox
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapAside = ({ place }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!place?.URLADDRESS || !mapContainer.current) {
      return;
    }

    // Cleanup previous map
    if (map) {
      map.remove();
    }

    try {
      const [lat, lng] = place.URLADDRESS.split(',').map(coord => parseFloat(coord.trim()));

      if (isNaN(lat) || isNaN(lng)) {
        console.error('Invalid coordinates');
        return;
      }

      const initializeMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: 14
      });

      initializeMap.on('load', () => {
        initializeMap.resize();
        
        // Add marker
        new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(initializeMap);
      });

      setMap(initializeMap);

      return () => {
        initializeMap.remove();
      };
    } catch (error) {
      console.error('Map initialization error:', error);
    }
  }, [place]);

  if (!place) return null;

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {place?.IMAGES?.NORMAL?.[0] && (
              <Image
                src={place.IMAGES.NORMAL[0]}
                alt={place.NAME}
                style={{ width: '100%', borderRadius: 8 }}
              />
            )}

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                {place.NAME}
              </h3>
              <p style={{ color: '#666' }}>
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                {place.ADDRESS}
              </p>
              
              {place?.DESCRIPTION && (
                <p style={{ color: '#666', fontSize: 14 }}>
                  {place.DESCRIPTION}
                </p>
              )}
            </div>

            <Button
              type="primary"
              block
              href={`https://www.google.com/maps/dir/?api=1&destination=${place?.URLADDRESS}`}
              target="_blank"
              icon={<EnvironmentOutlined />}
            >
              Chỉ đường đến đây
            </Button>
          </Space>
        </Col>
        
        <Col span={12}>
          <div 
            ref={mapContainer} 
            style={{ 
              width: '100%', 
              height: '400px',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative'
            }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default MapAside;