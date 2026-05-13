const AdminUsers = () => (
  <div className="p-6 lg:p-8">
    <div className="mb-6">
      <h1 className="text-2xl font-extrabold text-gray-800">Quản lý người dùng</h1>
      <p className="text-gray-500 text-sm mt-1">Xem và quản lý tất cả tài khoản trong hệ thống</p>
    </div>
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      </div>
      <p className="text-gray-600 font-semibold">Tính năng đang được phát triển</p>
      <p className="text-gray-400 text-sm mt-1">Chức năng quản lý người dùng sẽ sớm ra mắt.</p>
    </div>
  </div>
);

export default AdminUsers;
