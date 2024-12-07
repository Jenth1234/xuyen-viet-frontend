import React, { useState, useEffect } from 'react';
import { Card, Tag, Button, Spin, message, Tabs } from 'antd';
import { 
  GiftOutlined, 
  ClockCircleOutlined, 
  HistoryOutlined,
  DollarOutlined,
  CrownOutlined,
  WalletOutlined 
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import apiPromotion from '../api/apiPromotion';

const { TabPane } = Tabs;

const Promotions = () => {
  const [userCoins, setUserCoins] = useState(0);
  const [allPromotions, setAllPromotions] = useState([]);
  const [myPromotions, setMyPromotions] = useState([]);
  const [coinHistory, setCoinHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isTokenExists } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allPromosRes, userPromosRes, historyRes] = await Promise.all([
          apiPromotion.getAllPromotions(),
          isTokenExists() ? apiPromotion.getPromotions() : null,
          isTokenExists() ? apiPromotion.getCoinHistory() : null
        ]);
        
        if (allPromosRes) {
          console.log('All Promotions:', allPromosRes);
          setAllPromotions(allPromosRes);
        }

        if (userPromosRes) {
          setMyPromotions(userPromosRes.redeemedPromotions || []);
          setUserCoins(userPromosRes.coins || 0);
        }
        
        if (historyRes) {
          setCoinHistory(historyRes.coinHistory || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isTokenExists]);

  // Xử lý đổi khuyến mãi
  const handleRedeem = async (promotionCode) => {
    try {
      setLoading(true);
      await apiPromotion.redeemPromotion(promotionCode);
      message.success('Đổi khuyến mãi thành công!');
      
      // Refresh data
      const [userPromosRes, historyRes] = await Promise.all([
        apiPromotion.getPromotions(),
        apiPromotion.getCoinHistory()
      ]);
      
      if (userPromosRes) {
        setMyPromotions(userPromosRes.redeemedPromotions || []);
        setUserCoins(userPromosRes.coins || 0);
      }

      if (historyRes) {
        setCoinHistory(historyRes.coinHistory || []);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra xem promotion đã được đổi chưa
  const isPromotionRedeemed = (promotionCode) => {
    return myPromotions.some(p => p.promotionCode === promotionCode);
  };

  // Kiểm tra xem promotion có còn hiệu lực không
  const isPromotionValid = (promo) => {
    const now = new Date();
    const validFrom = new Date(promo.validFrom);
    const validUntil = new Date(promo.validUntil);
    return now >= validFrom && now <= validUntil && promo.status === 'ACTIVE';
  };

  // Kiểm tra xem promotion đã đạt giới hạn đổi chưa
  const isPromotionAvailable = (promo) => {
    return promo.currentRedemptions < promo.maxRedemptions;
  };

  // Component hiển thị coins
  const UserCoinsDisplay = () => (
    <motion.div 
      className="fixed top-24 right-4 bg-white rounded-xl shadow-lg p-4 z-50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-center gap-2">
        <WalletOutlined className="text-yellow-500 text-xl" />
        <span className="font-bold text-lg">{userCoins}</span>
        <span className="text-gray-500">coins</span>
      </div>
    </motion.div>
  );

  // Component hiển thị tất cả gói khuyến mãi
  const AvailablePromotionsTab = () => {
    console.log('Rendering promotions:', allPromotions);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.isArray(allPromotions) && allPromotions.map((promo, index) => {
          const redeemed = isPromotionRedeemed(promo.code);
          const isValid = isPromotionValid(promo);
          const isAvailable = isPromotionAvailable(promo);
          
          return (
            <motion.div
              key={promo._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="h-full rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                cover={
                  <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-2xl">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <GiftOutlined className="text-6xl text-white opacity-50" />
                    </div>
                    <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full 
                                  flex items-center gap-1 font-medium">
                      <CrownOutlined />
                      {promo.coinCost} coins
                    </div>
                  </div>
                }
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{promo.title}</h3>
                  <Tag color={redeemed ? 'success' : isValid && isAvailable ? 'blue' : 'red'}>
                    {redeemed ? 'Đã đổi' : 
                     !isValid ? 'Hết hạn' :
                     !isAvailable ? 'Hết lượt' : 
                     'Có thể đổi'}
                  </Tag>
                </div>
                
                <div className="space-y-3">
                  <p className="text-gray-600">{promo.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <ClockCircleOutlined className="text-blue-500" />
                    <span>Từ: {new Date(promo.validFrom).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ClockCircleOutlined className="text-red-500" />
                    <span>Đến: {new Date(promo.validUntil).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarOutlined className="text-green-500" />
                    <span>Giảm: {promo.discount.toLocaleString()}{promo.discountType === 'PERCENTAGE' ? '%' : 'đ'}</span>
                  </div>

                  {promo.minSpend > 0 && (
                    <div className="flex items-center gap-2">
                      <DollarOutlined className="text-purple-500" />
                      <span>Đơn tối thiểu: {promo.minSpend.toLocaleString()}đ</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <CrownOutlined className="text-yellow-500" />
                    <span>Còn lại: {promo.maxRedemptions - promo.currentRedemptions} lượt</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <GiftOutlined className="text-blue-500" />
                    <span>Loại: {promo.type}</span>
                  </div>
                </div>

                <Button
                  type="primary"
                  icon={<CrownOutlined />}
                  className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-yellow-500 border-0 
                           hover:from-yellow-500 hover:to-yellow-600"
                  onClick={() => handleRedeem(promo.code)}
                  disabled={redeemed || !isTokenExists() || userCoins < promo.coinCost || !isValid || !isAvailable}
                >
                  {!isTokenExists() ? 'Đăng nhập để đổi' :
                   redeemed ? 'Đã đổi' :
                   !isValid ? 'Hết hạn' :
                   !isAvailable ? 'Hết lượt' :
                   userCoins < promo.coinCost ? 'Không đủ coins' : 
                   'Đổi Ngay'}
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  };

  // Component hiển thị khuyến mãi đã đổi
  const MyPromotionsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {myPromotions.map((promo, index) => (
        <motion.div
          key={promo._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="h-full rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{promo.promotionName}</h3>
              <Tag color={promo.status === 'ACTIVE' ? 'green' : 'red'}>
                {promo.status}
              </Tag>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ClockCircleOutlined className="text-blue-500" />
                <span>Hết hạn: {new Date(promo.expiryDate).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <CrownOutlined className="text-yellow-500" />
                <span>Coins đã dùng: {promo.coinsSpent}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-500">
                <HistoryOutlined />
                <span>Đổi vào: {new Date(promo.redeemedAt).toLocaleString()}</span>
              </div>
            </div>

            <Button
              type="primary"
              icon={<GiftOutlined />}
              className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 border-0"
              onClick={() => {
                navigator.clipboard.writeText(promo.promotionCode);
                message.success('Đã sao chép mã');
              }}
            >
              Sao Chép Mã: {promo.promotionCode}
            </Button>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  // Component hiển thị lịch sử giao dịch
  const CoinHistoryTab = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {coinHistory.map((history, index) => (
        <motion.div
          key={history._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`flex justify-between items-center p-4 ${
            index !== coinHistory.length - 1 ? 'border-b' : ''
          }`}
        >
          <div>
            <div className="font-medium">{history.description}</div>
            <div className="text-sm text-gray-500">
              {new Date(history.createdAt).toLocaleString()}
            </div>
          </div>
          <Tag color={history.type === 'EARN' ? 'green' : 'red'}>
            {history.type === 'EARN' ? '+' : ''}{history.amount} coins
          </Tag>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {isTokenExists() && <UserCoinsDisplay />}
      
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <Tabs defaultActiveKey="1" className="bg-white rounded-xl p-6 shadow-sm">
            <TabPane 
              tab={
                <span>
                  <GiftOutlined />
                  Gói Khuyến Mãi
                </span>
              } 
              key="1"
            >
              <AvailablePromotionsTab />
            </TabPane>
            {isTokenExists() && (
              <>
                <TabPane 
                  tab={
                    <span>
                      <CrownOutlined />
                      Khuyến Mãi Đã Đổi
                    </span>
                  } 
                  key="2"
                >
                  <MyPromotionsTab />
                </TabPane>
                <TabPane 
                  tab={
                    <span>
                      <HistoryOutlined />
                      Lịch Sử Giao Dịch
                    </span>
                  } 
                  key="3"
                >
                  <CoinHistoryTab />
                </TabPane>
              </>
            )}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Promotions;