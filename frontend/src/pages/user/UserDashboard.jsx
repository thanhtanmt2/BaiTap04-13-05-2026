import { useState } from 'react';
import UserProfile from './UserProfile';
import Shop from '../Shop';
import './UserDashboard.css';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-container">
          <h1 className="dashboard-title">My Account</h1>
          <div className="tabs-container">
            <button
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="tab-icon">👤</span>
              Profile
            </button>
            <button
              className={`tab-button ${activeTab === 'shop' ? 'active' : ''}`}
              onClick={() => setActiveTab('shop')}
            >
              <span className="tab-icon">🛍️</span>
              Shop
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === 'profile' && <UserProfile />}
        {activeTab === 'shop' && <Shop />}
      </div>
    </div>
  );
};

export default UserDashboard;
