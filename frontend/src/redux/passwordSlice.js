import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../services/axiosClient';

// Thunk gửi OTP
export const requestOTP = createAsyncThunk(
  'password/requestOTP',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/forgot-password', { email });
      return { ...response.data, email };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi gửi OTP');
    }
  }
);

// Thunk reset mật khẩu
export const resetPassword = createAsyncThunk(
  'password/resetPassword',
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/reset-password', { email, otp, newPassword });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi reset mật khẩu');
    }
  }
);

const initialState = {
  step: 1, // 1: Nhập email, 2: Nhập OTP & Mật khẩu mới, 3: Thành công
  email: '',
  loading: false,
  error: null,
  successMessage: null,
};

const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    resetPasswordState: (state) => {
      state.step = 1;
      state.email = '';
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // requestOTP
      .addCase(requestOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(requestOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.step = 2;
        state.email = action.payload.email; // Lưu lại email để dùng ở bước sau
        state.successMessage = action.payload.message || 'OTP đã được gửi đến email của bạn!';
      })
      .addCase(requestOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.step = 3;
        state.successMessage = action.payload.message || 'Mật khẩu đã được đặt lại thành công!';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPasswordState, clearError } = passwordSlice.actions;
export default passwordSlice.reducer;
