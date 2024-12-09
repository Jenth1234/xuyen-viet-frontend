import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import DetailItinerary from './DetailItinerary';
import { getItinerary } from '../../api/ApiItinerary';
import { toast } from 'react-hot-toast';

const SharedItinerary = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [itineraryData, setItineraryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItineraryData = async () => {
      try {
        const response = await getItinerary(id);
        if (response.success && response.data) {
          setItineraryData(response.data);
        } else {
          toast.error('Không thể tải dữ liệu lịch trình');
          navigate('/highlight-itinerary');
        }
      } catch (error) {
        console.error('Error fetching itinerary:', error);
        toast.error('Có lỗi xảy ra khi tải dữ liệu');
        navigate('/highlight-itinerary');
      } finally {
        setLoading(false);
      }
    };

    fetchItineraryData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!itineraryData) {
    return null;
  }

  return (
    <DetailItinerary 
      itineraryId={id}
      viewOnly={true}
      initialData={itineraryData}
      fromShared={true}
    />
  );
};

export default SharedItinerary;