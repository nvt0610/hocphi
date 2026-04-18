import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { studentService } from '../../api/student.service';
import { classService } from '../../api/class.service';

const GENDER_OPTIONS = [
  { value: 'Nam', label: 'Nam' },
  { value: 'Nữ', label: 'Nữ' },
  { value: 'Khác', label: 'Khác' },
];

const StudentForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const isEdit = !!id;
  const isView = searchParams.get('mode') === 'view';

  const [formData, setFormData] = useState<{
    fullName: string;
    gender: string;
    dateOfBirth: string;
    phoneNumber: string;
    address: string;
    classIds: string[];
  }>({
    fullName: '',
    gender: 'Nam',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    classIds: []
  });

  const [classes, setClasses] = useState<any[]>([]);
  const [classSearch, setClassSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    initData();
  }, [id]);

  const initData = async () => {
    try {
      // 1. Fetch classes
      const resClasses = await classService.getAll();
      if (resClasses.success) {
        setClasses(resClasses.data || []);
      }

      // 2. Fetch student if editing
      if (isEdit) {
        const res = await studentService.getById(id!);
        if (res.success) {
          const student = res.data;
          
          let dob = '';
          if (student.dateOfBirth) {
            const date = new Date(student.dateOfBirth);
            if (!isNaN(date.getTime())) {
              dob = date.toISOString().split('T')[0];
            }
          }
          
          setFormData({
            fullName: student.fullName || '',
            gender: student.gender || 'Nam',
            dateOfBirth: dob,
            phoneNumber: student.phoneNumber || '',
            address: student.address || '',
            classIds: student.enrollments ? student.enrollments.map((e: any) => e.classId) : []
          });
        }
      }
    } catch (error) {
      console.error('Failed to init data', error);
      toast.error('Không thể tải dữ liệu');
    } finally {
      setFetching(false);
    }
  };

  const toggleClass = (classId: string) => {
    if (isView) return;
    setFormData(prev => {
      const isSelected = prev.classIds.includes(classId);
      if (isSelected) {
        return { ...prev, classIds: prev.classIds.filter(id => id !== classId) };
      } else {
        return { ...prev, classIds: [...prev.classIds, classId] };
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;
    
    if (!formData.fullName.trim()) {
      toast.warning('Vui lòng nhập Họ tên học sinh');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await studentService.update(id!, formData);
        toast.success(`Cập nhật học sinh ${formData.fullName} thành công`);
      } else {
        await studentService.create(formData);
        toast.success(`Thêm học sinh ${formData.fullName} thành công`);
      }
      navigate('/students');
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi lưu thông tin');
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter(cls => 
    cls.className.toLowerCase().includes(classSearch.toLowerCase())
  );

  if (fetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <span className="text-zinc-400 font-black animate-pulse uppercase tracking-[0.3em]">Đang chuẩn bị dữ liệu...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 flex flex-col pb-20">
        <div className="w-full">
          <PageHeader 
            title={isEdit ? (isView ? 'Chi tiết học sinh' : 'Cập nhật học sinh') : 'Thêm học sinh mới'} 
            subtitle={isEdit ? (isView ? `Đang xem hồ sơ: ${formData.fullName}` : `Chỉnh sửa hồ sơ: ${formData.fullName}`) : 'Tạo hồ sơ học sinh mới và ghi danh vào lớp học'}
            showBack
            onBack={() => navigate(-1)}
          />
        </div>

        <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Personal Info */}
          <div className="lg:col-span-8 bg-white p-10 rounded-[40px] border border-zinc-100 shadow-2xl shadow-zinc-200/50 space-y-10">
            <h3 className="text-[14px] font-black text-zinc-800 uppercase tracking-[0.2em] border-l-4 border-zinc-900 pl-6 py-1">Thông tin cá nhân</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="md:col-span-2 space-y-3">
                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">Họ và tên</label>
                <Input
                  required
                  placeholder="Nhập tên đầy đủ của học sinh..."
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="h-[72px] text-[18px] font-bold px-8 rounded-3xl"
                  disabled={isView}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">Giới tính</label>
                <div className="flex gap-4">
                  {GENDER_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => !isView && setFormData({ ...formData, gender: opt.value })}
                      className={`flex-1 h-[64px] rounded-2xl text-[14px] font-black transition-all border-2 ${
                        formData.gender === opt.value 
                          ? 'bg-zinc-900 border-zinc-900 text-white' 
                          : 'bg-zinc-50 border-zinc-50 text-zinc-400 hover:border-zinc-200'
                      } ${isView ? (formData.gender === opt.value ? '' : 'opacity-40 grayscale') : ''}`}
                      disabled={isView}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">Ngày sinh</label>
                <Input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="h-[64px] text-[15px] font-bold px-8 rounded-2xl"
                  disabled={isView}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                <Input
                  placeholder="Nhập số điện thoại liên hệ..."
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="h-[64px] text-[15px] font-bold px-8 rounded-2xl"
                  disabled={isView}
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">Địa chỉ liên lạc</label>
                <textarea
                  placeholder="Nhập địa chỉ chi tiết..."
                  name="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full min-h-[140px] p-8 bg-zinc-50 border border-zinc-100 rounded-[32px] text-[15px] font-bold text-zinc-800 focus:outline-none focus:ring-8 focus:ring-zinc-900/5 transition-all outline-none resize-none placeholder:text-zinc-300 disabled:opacity-70 disabled:bg-zinc-100"
                  disabled={isView}
                />
              </div>
            </div>
          </div>

          {/* Right Side: Class Selection */}
          <div className="lg:col-span-4 space-y-8 flex flex-col h-[720px] sticky top-8">
            <div className="bg-white p-10 rounded-[40px] border border-zinc-100 shadow-2xl shadow-zinc-200/50 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h3 className="text-[14px] font-black text-zinc-800 uppercase tracking-[0.2em] border-l-4 border-zinc-900 pl-6 py-1">Lớp học đăng ký</h3>
                  <p className="text-[11px] font-bold text-zinc-400 pl-7">Bạn có thể chọn nhiều lớp học cùng lúc</p>
                </div>
                {formData.classIds.length > 0 && (
                  <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[11px] font-black uppercase tracking-widest border border-emerald-100">
                    Đã chọn: {formData.classIds.length} lớp
                  </div>
                )}
              </div>

              <div className="relative mb-6">
                <Input
                  placeholder="Tìm lớp học..."
                  value={classSearch}
                  onChange={(e) => setClassSearch(e.target.value)}
                  className="h-[56px] text-sm font-bold pr-12 rounded-2xl bg-zinc-50 border-transparent focus:bg-white"
                  disabled={isView}
                />
                <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {filteredClasses.map((cls) => {
                  const isSelected = formData.classIds.includes(cls.id);
                  return (
                    <div 
                      key={cls.id}
                      onClick={() => !isView && toggleClass(cls.id)}
                      className={`flex items-center gap-4 p-5 rounded-3xl transition-all border-2 group ${
                        isView ? 'cursor-default' : 'cursor-pointer'
                      } ${
                        isSelected 
                          ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-900/20' 
                          : 'bg-zinc-50 border-zinc-50 hover:border-zinc-200 text-zinc-700'
                      } ${isView && !isSelected ? 'opacity-50 grayscale scale-[0.98]' : ''}`}
                    >
                      <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'bg-white border-white scale-110' : 'bg-white border-zinc-200 group-hover:border-zinc-300'
                      }`}>
                        {isSelected && (
                          <svg className="w-4 h-4 text-zinc-900" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[15px] font-black truncate">{cls.className}</span>
                        <span className={`text-[10px] font-bold ${isSelected ? 'text-zinc-400' : 'text-zinc-400'}`}>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cls.monthlyFee)}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {filteredClasses.length === 0 && (
                  <div className="py-20 text-center">
                    <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-black text-zinc-200 uppercase tracking-widest">Không có lớp học</span>
                  </div>
                )}
              </div>

              <div className="pt-8 mt-6 border-t border-zinc-100 flex gap-4">
                <Button 
                  type="button"
                  onClick={() => navigate('/students')} 
                  className={`flex-1 h-[64px] bg-zinc-100 !text-zinc-400 !shadow-none hover:bg-zinc-200 rounded-3xl font-black text-xs tracking-[0.2em] ${isView ? 'hidden' : ''}`}
                >
                  HỦY
                </Button>
                <Button 
                  type={isView ? 'button' : 'submit'}
                  onClick={isView ? () => navigate('/students') : undefined}
                  isLoading={loading}
                  className="flex-[2] h-[64px] bg-zinc-900 text-white rounded-3xl shadow-2xl shadow-zinc-900/30 font-black text-xs tracking-[0.2em]"
                >
                  {isView ? 'QUAY LẠI' : (isEdit ? 'CẬP NHẬT' : 'THÊM HỌC SINH')}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default StudentForm;
