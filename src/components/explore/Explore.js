import React, { useState, useEffect } from 'react';
import AttractionSlider from './AttractionSlider';
import {
  getAllProvincesWithFestivals,
  getAllProvincesWithByViews,
  getAllProvincesWithByCultural,
  getAllProvincesWithByBeaches,
  getAttractionByName,
} from '../../api/callApi';
import Search from '../../components/Search';

const Explore = () => {
  const [festivalsProvinces, setFestivalsProvinces] = useState([]);
  const [viewsProvinces, setViewsProvinces] = useState([]);
  const [culturalProvinces, setCulturalProvinces] = useState([]);
  const [beachesProvinces, setBeachesProvinces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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
      } catch (error) {
        console.error('Error fetching provinces data:', error);
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
    <div>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

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
    </div>
  );
};

export default Explore;
