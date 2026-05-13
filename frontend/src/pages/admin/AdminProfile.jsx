import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../../redux/authSlice';
import {
  fetchProfileThunk,
  updateProfileThunk,
  uploadAvatarThunk,
  clearProfileMessages,
} from '../../redux/profileSlice';
import Alert from '../../components/Alert';
import Button from '../../components/Button';

const BACKEND = 'http://localhost:3000';

const SkeletonLine = ({ width = 'w-32' }) => (
  <div className={`h-5 ${width} bg-gray-200 rounded-lg animate-pulse`} />
);

const FieldRow = ({ icon, label, value, loading }) => (
  <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
    <div className="shrink-0 w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 mt-0.5">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      {loading ? (
        <SkeletonLine width="w-40" />
      ) : (
        <p className="text-gray-800 font-medium break-words">
          {value || <span className="text-gray-400 italic font-normal">Chưa cập nhật</span>}
        </p>
      )}
    </div>
  </div>
);

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const IconPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const IconCamera = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
  </svg>
);

const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
  </svg>
);

const PHONE_REGEX = /^0\d{9,10}$/;

const AdminProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { profile, loading, saveLoading, avatarLoading, error, success } = useSelector((state) => state.profile);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({ full_name: '', phone: '', address: '' });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [editing, setEditing] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    dispatch(fetchProfileThunk());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!profile) return;
    const syncProfile = () => {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
      if (profile.avatar_url) setAvatarPreview(`${BACKEND}${profile.avatar_url}`);
    };
    syncProfile();
  }, [profile]);

  useEffect(() => {
    if (!user && profile) dispatch(updateProfile({ name: profile.full_name }));
  }, [profile]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => dispatch(clearProfileMessages()), 3000);
      return () => clearTimeout(t);
    }
  }, [success, dispatch]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    const result = await dispatch(uploadAvatarThunk(file));
    if (uploadAvatarThunk.fulfilled.match(result)) {
      setAvatarPreview(`${BACKEND}${result.payload.avatar_url}`);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (formData.phone && !PHONE_REGEX.test(formData.phone)) {
      setLocalError('So dien thoai khong hop le (10-11 chu so, bat dau bang 0)');
      return;
    }
    const result = await dispatch(updateProfileThunk(formData));
    if (updateProfileThunk.fulfilled.match(result)) {
      if (result.payload.profile?.full_name) {
        dispatch(updateProfile({ name: result.payload.profile.full_name }));
      }
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
    });
    setLocalError('');
    setEditing(false);
    dispatch(clearProfileMessages());
  };

  if (!isAuthenticated) return null;

  const displayName = user?.name || user?.email || 'Quan tri vien';
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const displayError = localError || error;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-extrabold text-gray-800">Hồ sơ quản trị viên</h1>
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">Admin</span>
        </div>
        <p className="text-gray-500 text-sm">Xem và cập nhật thông tin cá nhân</p>
      </div>

      {/* Avatar + basic info card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5 flex items-center gap-6">
        <div className="relative shrink-0">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="avatar"
              className={`w-24 h-24 rounded-2xl object-cover ring-4 ring-purple-100 transition-opacity ${avatarLoading ? 'opacity-60' : 'opacity-100'}`}
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-purple-100">
              {avatarInitial}
            </div>
          )}
          <label
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center cursor-pointer hover:bg-purple-700 transition shadow-md"
            title="Doi anh dai dien"
          >
            <IconCamera />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
          {avatarLoading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/50">
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="space-y-2">
              <SkeletonLine width="w-40" />
              <SkeletonLine width="w-56" />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-800 truncate">{displayName}</h2>
              <p className="text-gray-500 text-sm mt-0.5 truncate">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                Quan tri vien
              </span>
            </>
          )}
        </div>
      </div>

      <Alert type="error" message={displayError} />
      <Alert type="success" message={success} />

      {/* Profile details card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-700">Thông tin cá nhân</h2>
          {!editing && (
            <button
              onClick={() => { setLocalError(''); setEditing(true); }}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <IconEdit />
              Chỉnh sửa
            </button>
          )}
        </div>

        {!editing ? (
          <div>
            <FieldRow loading={loading} label="Ho & Ten" value={profile?.full_name} icon={<IconUser />} />
            <FieldRow loading={loading} label="So dien thoai" value={profile?.phone} icon={<IconPhone />} />
            <FieldRow loading={loading} label="Dia chi" value={profile?.address} icon={<IconPin />} />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Họ & Tên</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IconUser /></span>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Nguyen Van A"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IconPhone /></span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setLocalError(''); }}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="0912345678"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">10-11 chu so, bat dau bang 0</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400"><IconPin /></span>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  placeholder="123 Duong ABC, Quan 1, TP.HCM"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                type="submit"
                disabled={saveLoading}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-70"
              >
                {saveLoading ? 'Dang luu...' : 'Luu thay doi'}
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                disabled={saveLoading}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold transition disabled:opacity-70"
              >
                Huy
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
