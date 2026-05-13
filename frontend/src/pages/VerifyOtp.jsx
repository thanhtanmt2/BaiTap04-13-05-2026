import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axiosClient from '../services/axiosClient';
import Alert from '../components/Alert';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef([]);

  // Nếu không có email, redirect về register
  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

  // Đếm ngược cooldown gửi lại OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleDigitChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleaned;
    setDigits(newDigits);
    setError('');

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newDigits = [...digits];
    pasted.split('').forEach((ch, i) => { newDigits[i] = ch; });
    setDigits(newDigits);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length < 6) {
      setError('Vui lòng nhập đủ 6 chữ số OTP');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axiosClient.post('/auth/verify-otp', { email, otp });
      setSuccessMsg('Xác thực thành công! Đang chuyển hướng đến trang đăng nhập...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Mã OTP không chính xác hoặc đã hết hạn');
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resendLoading) return;
    setResendLoading(true);
    setError('');
    try {
      // Gọi lại register với email để server tạo OTP mới
      // Hoặc có thể có endpoint riêng /auth/resend-otp nếu backend hỗ trợ
      await axiosClient.post('/auth/resend-otp', { email });
      setCountdown(60);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi lại OTP. Vui lòng thử lại sau.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 w-full absolute top-0 left-0">
      <Link
        to="/register"
        className="absolute top-6 left-6 text-gray-500 hover:text-indigo-600 flex items-center gap-2 transition-colors font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Quay lại đăng ký
      </Link>

      <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-md transform transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-inner">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Xác thực tài khoản
          </h2>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Mã OTP đã được gửi đến{' '}
            <span className="font-semibold text-indigo-600">{email}</span>
            <br />
            Vui lòng kiểm tra hộp thư và nhập mã bên dưới
          </p>
        </div>

        <Alert type="error" message={error} />
        <Alert type="success" message={successMsg} />

        <form onSubmit={handleSubmit}>
          {/* 6 ô OTP */}
          <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 bg-white shadow-sm transition-all duration-200 focus:outline-none focus:scale-105
                  ${digit
                    ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                    : 'border-gray-200 text-gray-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
                  }`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || !!successMsg}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transform transition hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? 'Đang xác thực...' : 'Xác nhận OTP'}
          </button>
        </form>

        {/* Gửi lại OTP */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Không nhận được mã?{' '}
          {countdown > 0 ? (
            <span className="text-gray-400 font-medium">Gửi lại sau {countdown}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors disabled:opacity-50"
            >
              {resendLoading ? 'Đang gửi...' : 'Gửi lại OTP'}
            </button>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-gray-400 hover:text-indigo-600 transition-colors">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
