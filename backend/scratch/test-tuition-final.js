
const API_URL = 'http://localhost:3000';

async function testTuitionModule() {
  console.log('--- Đang kiểm tra Module Tuition ---');

  try {
    // 1. Đăng nhập
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'staff', password: 'staff123' })
    });
    const { data } = await loginRes.json();
    const token = data.accessToken;
    console.log('✅ Đăng nhập thành công.');

    const headers = { Authorization: `Bearer ${token}` };

    // 2. Test tìm kiếm theo tên học sinh
    console.log('\n2. Test tìm kiếm theo tên: "An"');
    const searchRes = await fetch(`${API_URL}/tuition-records?search=An`, { headers });
    const searchJson = await searchRes.json();
    const searchData = searchJson.data;
    console.log(`- Nhận được ${searchData.length} bản ghi.`);
    const hasAn = searchData.some(r => r.student.fullName.includes('An') || (r.content && r.content.includes('An')));
    console.log(`- Có chứa từ khoá "An": ${hasAn ? 'ĐÚNG' : 'SAI'}`);

    // 3. Test lọc theo trạng thái Paid
    console.log('\n3. Test lọc trạng thái: Paid');
    const paidRes = await fetch(`${API_URL}/tuition-records?status=Paid`, { headers });
    const paidJson = await paidRes.json();
    const paidData = paidJson.data;
    const allPaid = paidData.every(r => r.status === 'Paid');
    console.log(`- Nhận được ${paidData.length} bản ghi.`);
    console.log(`- Kiểm tra tất cả là "Paid": ${allPaid ? 'ĐÚNG' : 'SAI'}`);
    if (!allPaid) {
        console.log('- Các trạng thái thực tế:', [...new Set(paidData.map(r => r.status))]);
    }

    console.log('\n--- TẤT CẢ KIỂM TRA ĐÃ HOÀN TẤT ---');
  } catch (error) {
    console.error('❌ Kiểm tra thất bại:', error.message);
  }
}

testTuitionModule();
