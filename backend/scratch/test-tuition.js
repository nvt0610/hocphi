
const API_URL = 'http://localhost:3000';

async function testTuitionModule() {
  console.log('--- Đang kiểm tra Module Tuition ---');

  try {
    // 1. Đăng nhập
    console.log('1. Đang đăng nhập...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'staff',
        password: 'staff123'
      })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(JSON.stringify(loginData));
    
    const token = loginData.accessToken;
    console.log('✅ Đăng nhập thành công.');

    const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // 2. Test tìm kiếm theo tên học sinh
    console.log('\n2. Test tìm kiếm theo tên học sinh: "An"');
    const searchRes = await fetch(`${API_URL}/tuition-records?search=An`, { headers });
    const searchData = await searchRes.json();
    console.log(`- Nhận được ${Array.isArray(searchData) ? searchData.length : 'không phải mảng'} bản ghi.`);
    if (Array.isArray(searchData) && searchData.length > 0) {
      console.log(`- Ví dụ bản ghi: [${searchData[0].student?.fullName}] - ${searchData[0].content}`);
    }

    // 3. Test lọc theo trạng thái Paid
    console.log('\n3. Test lọc trạng thái: Paid');
    const paidRes = await fetch(`${API_URL}/tuition-records?status=Paid`, { headers });
    const paidData = await paidRes.json();
    if (Array.isArray(paidData)) {
      const allPaid = paidData.every(r => r.status === 'Paid');
      console.log(`- Nhận được ${paidData.length} bản ghi.`);
      console.log(`- Kiểm tra tất cả là "Paid": ${allPaid ? 'ĐÚNG' : 'SAI'}`);
    } else {
      console.log('- Lỗi: Kết quả không phải mảng', paidData);
    }

    // 4. Test lọc theo trạng thái Unpaid
    console.log('\n4. Test lọc trạng thái: Unpaid');
    const unpaidRes = await fetch(`${API_URL}/tuition-records?status=Unpaid`, { headers });
    const unpaidData = await unpaidRes.json();
    if (Array.isArray(unpaidData)) {
      const allUnpaid = unpaidData.every(r => r.status === 'Unpaid');
      console.log(`- Nhận được ${unpaidData.length} bản ghi.`);
      console.log(`- Kiểm tra tất cả là "Unpaid": ${allUnpaid ? 'ĐÚNG' : 'SAI'}`);
    } else {
      console.log('- Lỗi: Kết quả không phải mảng', unpaidData);
    }

    console.log('\n--- TẤT CẢ KIỂM TRA ĐÃ HOÀN TẤT ---');
  } catch (error) {
    console.error('❌ Kiểm tra thất bại:', error.message);
  }
}

testTuitionModule();
