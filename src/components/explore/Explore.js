import React, { useState, useEffect } from 'react';
import { Input, Spin } from 'antd';
import { getAllProvincesWithFestivals, getAllProvincesWithByViews, getAllProvincesWithByCultural, getAllProvincesWithByBeaches, getAttractionByName } from '../../api/callApi';
import AttractionSlider from './AttractionSlider';

const { Search } = Input;

const Explore = () => {
  const [festivalsProvinces, setFestivalsProvinces] = useState([]);
  const [viewsProvinces, setViewsProvinces] = useState([]);
  const [culturalProvinces, setCulturalProvinces] = useState([]);
  const [beachesProvinces, setBeachesProvinces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [festivalsResponse, viewsResponse, culturalResponse, beachesResponse] = await Promise.all([
          getAllProvincesWithFestivals(),
          getAllProvincesWithByViews(),
          getAllProvincesWithByCultural(),
          getAllProvincesWithByBeaches(),
        ]);

        setFestivalsProvinces(festivalsResponse.success ? festivalsResponse.data : []);
        setViewsProvinces(viewsResponse.success ? viewsResponse.data : []);
        setCulturalProvinces(culturalResponse.success ? culturalResponse.data : []);
        setBeachesProvinces(beachesResponse.success ? beachesResponse.data : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching provinces data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm) {
        try {
          const response = await getAttractionByName(searchTerm);
          setSearchResults(response.success ? response.data : []);
        } catch (error) {
          console.error('Error searching attraction by name:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  const filterProvinces = (provinces) => {
    return provinces.filter((province) =>
      province.NAME.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="p-6 bg-gray-100">
      <Search
        placeholder="Tìm kiếm địa điểm"
        enterButton="Tìm kiếm"
        size="large"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
      />

      {loading ? (
        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }} />
      ) : (
        <>
          {searchTerm ? (
            <AttractionSlider title="Kết quả tìm kiếm" provinces={searchResults} />
          ) : (
            <>
              <AttractionSlider title="Địa điểm đáng đi trong năm" provinces={filterProvinces(festivalsProvinces)} />
              <AttractionSlider title="Điểm đến dành cho kỳ nghỉ" provinces={filterProvinces(viewsProvinces)} />
              <AttractionSlider title="Địa điểm có di sản văn hóa và lịch sử" provinces={filterProvinces(culturalProvinces)} />
              <AttractionSlider title="Trải nghiệm các lễ hội và sự kiện đặc biệt" provinces={filterProvinces(beachesProvinces)} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Explore;
