import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Legacy route /profile — redirect theo role
const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    if (user?.role === 'admin') {
      navigate('/admin/profile', { replace: true });
    } else {
      navigate('/user/profile', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return null;
};

export default Profile;
